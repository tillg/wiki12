package net.mgmtp.wiki12.slug;

import com.mgmtp.a12.dataservices.document.DataServicesDocument;
import com.mgmtp.a12.dataservices.document.DocumentReference;
import com.mgmtp.a12.dataservices.document.persistence.IDocumentRepository;
import com.mgmtp.a12.kernel.md.document.apiV2.DocumentPointer;
import com.mgmtp.a12.kernel.md.document.apiV2.PathPart;
import com.mgmtp.a12.kernel.md.document.apiV2.UpdateAction;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.FieldInstanceV2;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.GroupInstanceV2;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.RepetitionsV2;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Derives the wiki12 standard content envelope — {@code slug}, {@code searchText},
 * {@code CreatedOn}, derived {@code Title}, and the append-only {@code Changes} log —
 * for a content document inside the write transaction (ADR-0001 / ADR-0006).
 *
 * <p>Uses the immutable A12 {@link DocumentV2} API: read field values by path with
 * {@link DocumentV2#fieldValue(String)}, write with {@link UpdateAction#putFieldValue}
 * batched via {@link DocumentV2#withBatchUpdates}, and append a change-log repetition
 * with {@link DocumentV2#withGroupRepetitionAppended}. The per-model paths come from
 * {@link ModelConfigRegistry} (read from the DM JSON).
 *
 * <p>Slug collision (the sticky {@code _N} suffix) and the cross-document advisory
 * lock are NOT handled here — see {@code AUTONOMOUS-DECISIONS.md}; the bare
 * {@code <type>:<name>} slug is derived. Uniqueness is enforced opportunistically by
 * the caller if a collision service is wired later.
 */
@Component
public class ContentDerivationService {

    private static final Logger log = LoggerFactory.getLogger(ContentDerivationService.class);

    private final ModelConfigRegistry registry;
    private final IDocumentRepository documentRepository;

    public ContentDerivationService(ModelConfigRegistry registry, IDocumentRepository documentRepository) {
        this.registry = registry;
        this.documentRepository = documentRepository;
    }

    /** Outcome of a derivation: the (possibly) mutated document plus the rename diff. */
    public record Result(DocumentV2 document, boolean changed, String oldSlug, String newSlug) {
        public boolean slugChanged() {
            return oldSlug != null && newSlug != null && !oldSlug.equals(newSlug);
        }
    }

    public Result deriveForCreate(DocumentV2 document) {
        return derive(document, null);
    }

    public Result deriveForUpdate(DocumentV2 updated, DocumentV2 persisted) {
        return derive(updated, persisted);
    }

    private Result derive(DocumentV2 document, DocumentV2 persisted) {
        String modelId = document.getDocumentModelId();
        ModelDerivationConfig config = registry.forModel(modelId);
        if (config == null || !config.hasSlugTarget()) {
            // Not a wiki12 content model (no derived slug field) — leave untouched.
            return new Result(document, false, null, null);
        }

        boolean isCreate = persisted == null;
        String type = namespaceFor(modelId);

        // (a) Name part from key fields in order; slug = <type>:<name>.
        List<String> keyValues = readValues(document, config.keyFieldPaths());
        String namePart = Slugifier.deriveName(keyValues);
        String base = type + ":" + namePart;

        // (b) Collision suffix: a sticky _N on the name part. Preserved on update when the
        // name part is unchanged; otherwise pick the next free ordinal for the base.
        String oldSlug = persisted == null ? null : readValue(persisted, config.slugFieldPath());
        // base and the old slug-minus-suffix are both namespaced (e.g. "page:foo"); equal
        // means the name part is unchanged, so keep the (possibly suffixed) existing slug.
        String oldBase = (oldSlug == null || oldSlug.isEmpty()) ? null : stripSuffixToNamePart(oldSlug);
        String selfId = persisted == null ? null : bareId(persisted.getId().orElse(null));
        String newSlug = base.equals(oldBase)
                ? oldSlug
                : uniqueSlug(modelId, config.slugFieldPath(), base, selfId);

        List<UpdateAction> updates = new ArrayList<>();
        updates.add(UpdateAction.putFieldValue(config.slugFieldPath(), newSlug));

        if (config.hasSearchTextTarget()) {
            List<String> searchableValues = readValues(document, config.searchableFieldPaths());
            updates.add(UpdateAction.putFieldValue(config.searchTextFieldPath(),
                    Slugifier.searchText(searchableValues)));
        }

        // A12 stores a DateTimeType value as a java.time.Instant (the FieldValueConverter
        // serializes it via the field's format); a String value is rejected.
        Instant now = Instant.now().truncatedTo(ChronoUnit.SECONDS);

        // CreatedOn: stamped once at create; on update, carried over from the persisted
        // document (the client's MODIFY payload omits derived fields, so re-seed it).
        if (config.hasCreatedOnTarget()) {
            if (isCreate) {
                updates.add(UpdateAction.putFieldValue(config.createdOnFieldPath(), now));
            } else {
                Object createdOn = safeFieldValueObj(persisted, config.createdOnFieldPath());
                if (createdOn != null) {
                    updates.add(UpdateAction.putFieldValue(config.createdOnFieldPath(), createdOn));
                }
            }
        }

        // Title: derived display label from the key-field values (only for models that declare it).
        if (config.hasTitleTarget()) {
            updates.add(UpdateAction.putFieldValue(config.titleFieldPath(),
                    Slugifier.displayTitle(keyValues)));
        }

        DocumentV2 mutated = document.withBatchUpdates(updates);

        // Changes: append one {ChangedOn, Summary} repetition per write. The append-only
        // log must survive updates — the client's MODIFY payload doesn't carry the prior
        // Changes, so re-seed them from the persisted document before appending.
        if (config.hasChangeLog()) {
            if (!isCreate) {
                mutated = carryOverChangeLog(mutated, persisted, config);
            }
            String summary = isCreate
                    ? Slugifier.SUMMARY_CREATED
                    : Slugifier.updateSummary(changedFieldLabels(document, persisted, config));
            mutated = appendChangeEntry(mutated, config, now, summary);
        }

        log.debug("wiki12: derived envelope for {} — slug={}, create={}", modelId, newSlug, isCreate);
        return new Result(mutated, true, oldSlug, newSlug);
    }

    /**
     * The pointer to the change-log group: each part carries a 1-based repetition index,
     * the last part is 0 (the append/all-repetitions "wildcard"). E.g. {@code Page[1]/Changes[0]}.
     * The plain string path is rejected by the group APIs, which require this shape.
     */
    private static DocumentPointer changesPointer(ModelDerivationConfig config) {
        return DocumentPointer.of(List.of(
                PathPart.of(config.rootGroupName(), 1),
                PathPart.of(lastSegment(config.changeLogGroupPath()), 0)));
    }

    /** Copy the persisted document's change-log repetitions onto the updated document. */
    private DocumentV2 carryOverChangeLog(DocumentV2 updated, DocumentV2 persisted,
            ModelDerivationConfig config) {
        try {
            RepetitionsV2 prior = persisted.groupAllRepetitions(changesPointer(config));
            if (prior != null && prior.size() > 0) {
                return updated.withGroupAllRepetitions(changesPointer(config), prior);
            }
        } catch (RuntimeException e) {
            log.warn("wiki12: could not carry over change-log; appending fresh", e);
        }
        return updated;
    }

    /** Append a change-log repetition built as a GroupInstanceV2 of {ChangedOn, Summary}. */
    private DocumentV2 appendChangeEntry(DocumentV2 document, ModelDerivationConfig config,
            Instant now, String summary) {
        String dtField = lastSegment(config.changeDatetimePath());
        String sumField = lastSegment(config.changeSummaryPath());

        Map<String, FieldInstanceV2> fields = new LinkedHashMap<>();
        fields.put(dtField, FieldInstanceV2.ofValue(now));
        fields.put(sumField, FieldInstanceV2.ofValue(summary));

        GroupInstanceV2 entry = GroupInstanceV2.of(Map.of(), fields);
        return document.withGroupRepetitionAppended(changesPointer(config), entry);
    }

    private static Object safeFieldValueObj(DocumentV2 doc, String path) {
        if (doc == null || path == null) {
            return null;
        }
        try {
            return doc.fieldValue(path);
        } catch (RuntimeException e) {
            return null;
        }
    }

    private List<String> changedFieldLabels(DocumentV2 updated, DocumentV2 persisted,
            ModelDerivationConfig config) {
        List<String> labels = new ArrayList<>();
        for (EditableField ef : config.editableFields()) {
            if (!Objects.equals(readValue(updated, ef.path()), readValue(persisted, ef.path()))) {
                labels.add(ef.label());
            }
        }
        return labels;
    }

    // ------------------------------------------------------------------

    private List<String> readValues(DocumentV2 document, List<String> paths) {
        List<String> values = new ArrayList<>(paths.size());
        for (String path : paths) {
            values.add(readValue(document, path));
        }
        return values;
    }

    private String readValue(DocumentV2 document, String path) {
        if (path == null) {
            return "";
        }
        try {
            Object v = document.fieldValue(path);
            return v == null ? "" : v.toString();
        } catch (RuntimeException e) {
            return "";
        }
    }

    /**
     * The lowest-ordinal free slug for {@code base}: {@code base} itself if unused, else
     * {@code base_2}, {@code base_3}, … Scans existing slugs of the model via the
     * repository (excluding {@code selfId}). NOTE: no advisory lock, so two concurrent
     * creates of the same name could still collide — the documented spike limitation
     * (specs/changes/basic_setup/spike-slug-concurrency.md); fine for single-writer use.
     */
    private String uniqueSlug(String modelId, String slugPath, String base, String selfId) {
        java.util.Set<String> existing = existingSlugs(modelId, slugPath, base, selfId);
        if (!existing.contains(base)) {
            return base;
        }
        int n = 2;
        while (existing.contains(base + "_" + n)) {
            n++;
        }
        return base + "_" + n;
    }

    /** Slugs of other documents of this model that equal {@code base} or start with {@code base_}. */
    private java.util.Set<String> existingSlugs(String modelId, String slugPath, String base, String selfId) {
        java.util.Set<String> slugs = new java.util.HashSet<>();
        try {
            for (DocumentReference ref : documentRepository.findAllDocRefsForModel(modelId)) {
                DataServicesDocument dsDoc = documentRepository.findByDocumentReference(ref).orElse(null);
                if (dsDoc == null) {
                    continue;
                }
                DocumentV2 other = dsDoc.getKernelDocument();
                if (selfId != null && selfId.equals(bareId(other.getId().orElse(null)))) {
                    continue; // exclude self on update
                }
                String s = readValue(other, slugPath);
                if (s.equals(base) || s.startsWith(base + "_")) {
                    slugs.add(s);
                }
            }
        } catch (RuntimeException e) {
            log.warn("wiki12: slug collision scan failed for {} — assuming no collision", modelId, e);
        }
        return slugs;
    }

    private static String lastSegment(String path) {
        int slash = path.lastIndexOf('/');
        return slash < 0 ? path : path.substring(slash + 1);
    }

    /** A12 getId() may be the full "Model_DM/<uuid>" docRef; keep only the uuid (null-safe). */
    private static String bareId(String rawId) {
        if (rawId == null) {
            return null;
        }
        int slash = rawId.lastIndexOf('/');
        return slash < 0 ? rawId : rawId.substring(slash + 1);
    }

    private String namespaceFor(String modelId) {
        // "Page_DM" -> "page", "Person_DM" -> "person".
        String id = modelId.endsWith("_DM") ? modelId.substring(0, modelId.length() - 3) : modelId;
        return id.toLowerCase();
    }

    private String stripSuffixToNamePart(String slug) {
        int colon = slug.indexOf(':');
        int lastUnderscore = slug.lastIndexOf('_');
        if (lastUnderscore > colon) {
            String tail = slug.substring(lastUnderscore + 1);
            if (!tail.isEmpty() && tail.chars().allMatch(Character::isDigit)) {
                return slug.substring(0, lastUnderscore);
            }
        }
        return slug;
    }
}
