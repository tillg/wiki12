package net.mgmtp.wiki12.slug;

import com.mgmtp.a12.dataservices.document.persistence.IDocumentRepository;
import com.mgmtp.a12.dataservices.model.persistence.IModelLoader;
import com.mgmtp.a12.dataservices.query.QueryService;
import com.mgmtp.a12.dataservices.query.QueryRoot;
import com.mgmtp.a12.kernel.md.document.v2.DocumentV2;
import com.mgmtp.a12.kernel.md.document.v2.UpdateAction;
import com.mgmtp.a12.kernel.md.facade.DocumentModelServiceFactory;
import com.mgmtp.a12.kernel.md.facade.IDocumentModelSearchService;
import com.mgmtp.a12.kernel.md.model.IDocumentModel;
import com.mgmtp.a12.kernel.md.model.IField;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * Computes the derived {@code slug} and {@code searchText} for a wiki12 content
 * document inside the write transaction, and serializes same-name writes with a
 * transaction-scoped Postgres advisory lock.
 *
 * <p>Mechanism (findings §1a, ADR-0001):
 * <ol>
 *   <li>Read the model's key fields in {@code wiki12.keyField} order; derive the name
 *       via {@link Slugifier#deriveName(List)} and namespace it with the model's type.</li>
 *   <li>Take {@code pg_advisory_xact_lock(hashtext(textPart))} so concurrent creates of
 *       the same name serialize (auto-released at commit/rollback).</li>
 *   <li>Query existing slugs for the type; assign the sticky {@code _N} suffix on
 *       collision (keep the existing suffix when the name part is unchanged on update).</li>
 *   <li>Write the {@code slug} field and the {@code searchText} blob
 *       (concatenation of {@code wiki12.searchable} fields).</li>
 * </ol>
 *
 * <p><b>Concurrency gate:</b> the advisory lock rests on the still-unverified ability
 * to inject a raw {@code JdbcTemplate} bound to the request transaction
 * (findings §1a Probe A / ADR-0002 residual). See {@code server/README.md}.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ContentDerivationService {

    // VERIFY: JdbcTemplate must be backed by the SAME DataSource/transaction A12 uses
    // for the write (spring.datasources.dataservices). If A12 registers multiple
    // DataSources, this likely needs @Qualifier("dataservices...") or an injected
    // DataSource wrapped here. This is the hard gate (findings §1a, Probe A).
    private final JdbcTemplate jdbcTemplate;
    private final QueryService queryService;
    private final IDocumentRepository documentRepository;
    private final IModelLoader<IDocumentModel> documentModelLoader;
    private final DocumentModelServiceFactory documentModelServiceFactory;

    /** Outcome of a derivation: the (possibly) mutated document plus the rename diff. */
    public record Result(DocumentV2 document, boolean changed, String oldSlug, String newSlug) {
        boolean slugChanged() {
            return oldSlug != null && newSlug != null && !oldSlug.equals(newSlug);
        }
    }

    /** Derive slug + searchText for a brand-new document. */
    public Result deriveForCreate(DocumentV2 document) {
        return derive(document, null);
    }

    /** Re-derive slug + searchText for an update, preserving suffix when the name is unchanged. */
    public Result deriveForUpdate(DocumentV2 updated, DocumentV2 persisted) {
        return derive(updated, persisted);
    }

    private Result derive(DocumentV2 document, DocumentV2 persisted) {
        String modelId = document.getDocumentModelId();
        IDocumentModel model = documentModelLoader.loadModel(modelId);
        IDocumentModelSearchService search = documentModelServiceFactory.createDocumentModelSearchService(model);

        ModelDerivationConfig config = readConfig(search);
        if (!config.hasSlugTarget()) {
            // Not a wiki12 content model (no derived slug field) — leave untouched.
            return new Result(document, false, null, null);
        }

        String type = namespaceFor(modelId);

        // (a) Derive the name part from key fields in order.
        List<String> keyValues = readFieldValues(document, config.keyFieldPaths());
        String namePart = Slugifier.deriveName(keyValues);
        String base = type + ":" + namePart;

        // (b) Advisory lock on the slug text part — serializes same-name writes.
        // VERIFY (hard gate, findings §1a): confirm this runs inside A12's write
        // transaction so the lock auto-releases on commit/rollback. A12 starts the
        // main transaction before the listener runs, so a JdbcTemplate bound to the
        // same DataSource participates in it.
        lockSlugText(base);

        // (c) Collision handling -> sticky _N suffix.
        String oldSlug = persisted == null ? null : readFieldValue(persisted, config.slugFieldPath());
        String oldNamePart = oldSlug == null ? null : stripSuffixToNamePart(oldSlug);

        String newSlug;
        if (persisted != null && namePart.equals(oldNamePart)) {
            // Update with unchanged name part: keep the existing (possibly suffixed) slug.
            newSlug = oldSlug;
        } else {
            int n = nextAvailableOrdinal(modelId, config.slugFieldPath(), base,
                    persisted == null ? null : readDocRef(persisted));
            newSlug = Slugifier.withSuffix(base, n);
        }

        // (d) Build searchText blob.
        List<String> searchableValues = readFieldValues(document, config.searchableFieldPaths());
        String searchText = Slugifier.searchText(searchableValues);

        List<UpdateAction> updates = new ArrayList<>();
        updates.add(UpdateAction.putFieldValue(config.slugFieldPath(), newSlug));
        if (config.hasSearchTextTarget()) {
            updates.add(UpdateAction.putFieldValue(config.searchTextFieldPath(), searchText));
        }

        // (e) Standard content envelope (specs/changes/mandatory-content-fields).
        boolean isCreate = persisted == null;
        String now = nowIso();

        // CreatedOn: stamped once at create, never on update (immutable audit).
        if (isCreate && config.hasCreatedOnTarget()) {
            updates.add(UpdateAction.putFieldValue(config.createdOnFieldPath(), now));
        }

        // Title: human display label derived from the key-field values (original
        // casing), for models that declare a derived title. Re-derived every write.
        if (config.hasTitleTarget()) {
            updates.add(UpdateAction.putFieldValue(config.titleFieldPath(),
                    Slugifier.displayTitle(keyValues)));
        }

        // Changes: append one entry {ChangedOn=now, Summary} per write.
        if (config.hasChangeLog()) {
            String summary = isCreate
                    ? Slugifier.SUMMARY_CREATED
                    : Slugifier.updateSummary(changedFieldLabels(document, persisted, config));
            appendChangeEntry(updates, config, persisted, now, summary);
        }

        // VERIFY: withBatchUpdates(...) is the documented batched-mutation API
        // (dev_tutorial_backend_document_manipulation.md). It returns a new immutable
        // DocumentV2.
        DocumentV2 mutated = document.withBatchUpdates(updates);

        return new Result(mutated, true, oldSlug, newSlug);
    }

    // ------------------------------------------------------------------
    // Standard content envelope helpers
    // ------------------------------------------------------------------

    /**
     * The current write instant as the string A12 stores for a {@code DateTimeType}.
     */
    private String nowIso() {
        // VERIFY (envelope #1, #3): two assumptions bundled here.
        //  (1) Write clock — whether DocumentBefore*Event / the kernel exposes a canonical
        //      transaction timestamp to prefer over server wall-clock. Using Instant.now()
        //      for now (the model timeZone is UTC).
        //  (2) DateTimeType wire format — confirm the exact ISO string A12 expects for a
        //      DateTimeType field value (Instant.toString() yields e.g. 2026-06-14T10:15:30Z).
        return Instant.now().toString();
    }

    /** Labels of the user-editable fields whose value differs between updated and persisted. */
    private List<String> changedFieldLabels(DocumentV2 updated, DocumentV2 persisted,
            ModelDerivationConfig config) {
        List<String> labels = new ArrayList<>();
        for (EditableField ef : config.editableFields()) {
            String now = readFieldValue(updated, ef.path());
            String before = readFieldValue(persisted, ef.path());
            if (!Objects.equals(now, before)) {
                labels.add(ef.label());
            }
        }
        return labels;
    }

    /** Append a {@code {ChangedOn, Summary}} repetition to the change-log group. */
    private void appendChangeEntry(List<UpdateAction> updates, ModelDerivationConfig config,
            DocumentV2 persisted, String now, String summary) {
        // The new entry goes at the next free index = current repetition count (0 on create).
        int index = persisted == null ? 0 : changeEntryCount(persisted, config.changeLogGroupPath());
        String group = config.changeLogGroupPath();
        String entry = group + "[" + index + "]";
        // datetime/summary paths are group-relative; re-root them under the indexed entry.
        String dtPath = entry + config.changeDatetimePath().substring(group.length());
        String sumPath = entry + config.changeSummaryPath().substring(group.length());
        // VERIFY (envelope #2): adding a repetition to a repeatable group. We model it as a
        // putFieldValue on the indexed path "/Changes[N]/Field"; confirm A12 auto-creates the
        // Nth repetition on first write to an indexed path, or whether a dedicated
        // "add repetition" UpdateAction / document-builder call is required first.
        updates.add(UpdateAction.putFieldValue(dtPath, now));
        updates.add(UpdateAction.putFieldValue(sumPath, summary));
    }

    /** Number of existing repetitions in the change-log group of a persisted document. */
    private int changeEntryCount(DocumentV2 document, String groupPath) {
        // VERIFY (envelope #2): reading the repetition count of a repeatable group from a
        // DocumentV2 (likely via the field/group instance API). Stubbed to 0 until wired —
        // until then updates would overwrite entry 0 rather than append.
        return 0;
    }

    /** Display label of a field (for the change-log diff); falls back to the field name. */
    private String fieldLabel(IField field) {
        // VERIFY (envelope #4): reading a field's localized label (IField label accessor).
        // Falls back to the field name, which is always available.
        try {
            return field.getName();
        } catch (RuntimeException e) {
            return "field";
        }
    }

    // ------------------------------------------------------------------
    // Advisory lock
    // ------------------------------------------------------------------

    private void lockSlugText(String slugTextPart) {
        // pg_advisory_xact_lock takes a bigint; hashtext() maps the text to int4, which
        // Postgres widens to bigint. Auto-released at transaction end.
        jdbcTemplate.queryForObject(
                "select pg_advisory_xact_lock(hashtext(?))",
                Void.class,
                slugTextPart);
        // VERIFY: queryForObject with Void.class may not be the right call shape for a
        // function returning void; pg_advisory_xact_lock returns void. If the driver
        // rejects Void.class, use jdbcTemplate.execute / queryForRowSet, or
        // "select 1 from (select pg_advisory_xact_lock(hashtext(?))) t".
    }

    // ------------------------------------------------------------------
    // Collision query: find the next free _N for this base
    // ------------------------------------------------------------------

    private int nextAvailableOrdinal(String modelId, String slugFieldPath, String base, String selfDocRef) {
        // Query all existing slugs for this model whose value starts with the base.
        // We can't do a prefix match with exact_match, so we fetch candidates and
        // filter in Java (the set per name is tiny — collisions are rare).
        // VERIFY: a "starts_with"/"simple_search" prefix operator would be more
        // efficient; exact_match on base + exact_match on base_2.. is also possible but
        // unbounded. Here we list slugs for the model and filter. Confirm the cheapest
        // operator against the Query API (dataservices-documentation-src.md §Query).
        List<String> existing = queryExistingSlugs(modelId, slugFieldPath, base, selfDocRef);

        boolean baseTaken = existing.stream().anyMatch(base::equals);
        if (!baseTaken) {
            return 1;
        }
        int max = 1;
        String prefix = base + "_";
        for (String s : existing) {
            if (s.startsWith(prefix)) {
                String tail = s.substring(prefix.length());
                try {
                    max = Math.max(max, Integer.parseInt(tail));
                } catch (NumberFormatException ignore) {
                    // a name that legitimately ends with _<word> is not a suffix; skip.
                }
            }
        }
        return max + 1;
    }

    private List<String> queryExistingSlugs(String modelId, String slugFieldPath, String base, String selfDocRef) {
        // VERIFY: QueryRoot.builder()/projectionName("document")/fields(...) mirror
        // dev_tutorial_backend_custom_endpoint.md. We project just the slug field +
        // docRef. The exact result-row type and accessor (DocumentTreeResult.getDocRef
        // / field projection access) is inferred; confirm how a projected scalar field
        // is read from the QueryPage rows.
        QueryRoot queryRoot = QueryRoot.builder()
                .targetDocumentModel(modelId)
                .projectionName("document")
                .fields(List.of(slugFieldPath, "/__meta/docRef"))
                .build();

        List<String> slugs = new ArrayList<>();
        try {
            // We pass null locale (slug is not localized), as the tutorial does for
            // non-localized values.
            queryService.query(queryRoot, null).getContent().forEach(row -> {
                // VERIFY: row is the projection result; extracting the slug scalar and
                // the docRef from it is API-specific. Pseudocode shape below.
                String docRef = extractDocRef(row);
                if (selfDocRef != null && selfDocRef.equals(docRef)) {
                    return; // ignore self on update
                }
                String slug = extractSlug(row, slugFieldPath);
                if (slug != null && (slug.equals(base) || slug.startsWith(base + "_"))) {
                    slugs.add(slug);
                }
            });
        } catch (RuntimeException e) {
            log.warn("Slug collision query failed for model {} — assuming no collisions", modelId, e);
        }
        return slugs;
    }

    // VERIFY: the two extractors below depend on the concrete QueryPage row type. The
    // tutorial casts rows to DocumentTreeResult and calls getDocRef(); reading a
    // projected field value from a row is not shown. Implement against the live API.
    private String extractDocRef(Object row) {
        // e.g. ((DocumentTreeResult) row).getDocRef().toString()
        return null;
    }

    private String extractSlug(Object row, String slugFieldPath) {
        // e.g. read the projected scalar at slugFieldPath from the row's field map
        return null;
    }

    private String readDocRef(DocumentV2 document) {
        // VERIFY: how to read the docRef of an already-persisted DocumentV2 (likely via
        // document metadata / getMetadata().getDocRef()). Used to exclude self on update.
        return null;
    }

    // ------------------------------------------------------------------
    // Model config: read wiki12.* annotations from the document model
    // ------------------------------------------------------------------

    private ModelDerivationConfig readConfig(IDocumentModelSearchService search) {
        // VERIFY: iterating all fields of the model and reading each field's
        // annotations. The tutorial uses search.getByPath(path) for a known path and
        // IField.getFieldType(); reading IField.getAnnotations() (name/value pairs) and
        // enumerating all fields is inferred. Likely search.getAllFields() or a model
        // walk; annotation access likely IField.getAnnotations() -> List<IAnnotation>
        // with getName()/getValue(). Confirm against kernel-documentation-dev.md.
        List<IField> fields = allFields(search);

        List<KeyField> keyFields = new ArrayList<>();
        String slugFieldPath = null;
        String searchTextFieldPath = null;
        String createdOnFieldPath = null;
        String titleFieldPath = null;
        String changeDatetimePath = null;
        String changeSummaryPath = null;
        List<String> searchablePaths = new ArrayList<>();
        List<EditableField> editableFields = new ArrayList<>();

        for (IField field : fields) {
            String path = fieldPath(field);
            String keyOrder = annotationValue(field, WikiAnnotations.KEY_FIELD);
            if (keyOrder != null) {
                keyFields.add(new KeyField(path, keyOrder));
            }
            String derived = annotationValue(field, WikiAnnotations.DERIVED);
            String changeField = annotationValue(field, WikiAnnotations.CHANGE_FIELD);
            if (WikiAnnotations.DERIVED_SLUG.equals(derived)) {
                slugFieldPath = path;
            } else if (WikiAnnotations.DERIVED_SEARCH_TEXT.equals(derived)) {
                searchTextFieldPath = path;
            } else if (WikiAnnotations.DERIVED_CREATED_ON.equals(derived)) {
                createdOnFieldPath = path;
            } else if (WikiAnnotations.DERIVED_TITLE.equals(derived)) {
                titleFieldPath = path;
            } else if (WikiAnnotations.CHANGE_FIELD_DATETIME.equals(changeField)) {
                changeDatetimePath = path;
            } else if (WikiAnnotations.CHANGE_FIELD_SUMMARY.equals(changeField)) {
                changeSummaryPath = path;
            } else if (derived == null && changeField == null) {
                // A user-editable field (no derived/changeField role) — tracked for the
                // change-log diff. Key fields are editable too, so they are included.
                editableFields.add(new EditableField(path, fieldLabel(field)));
            }
            if (WikiAnnotations.SEARCHABLE_TRUE.equals(annotationValue(field, WikiAnnotations.SEARCHABLE))) {
                searchablePaths.add(path);
            }
        }

        keyFields.sort(Comparator.comparing(kf -> kf.order));
        List<String> keyPaths = keyFields.stream().map(kf -> kf.path).toList();

        // The change-log group is the parent of its datetime/summary child fields, so
        // its path is the datetime field's path with the last segment removed
        // ("/Changes/ChangedOn" -> "/Changes"). Avoids a separate group annotation walk.
        String changeLogGroupPath = changeDatetimePath == null
                ? null
                : changeDatetimePath.substring(0, changeDatetimePath.lastIndexOf('/'));

        return new ModelDerivationConfig(keyPaths, slugFieldPath, searchTextFieldPath, searchablePaths,
                createdOnFieldPath, titleFieldPath, changeLogGroupPath, changeDatetimePath,
                changeSummaryPath, editableFields);
    }

    // ------------------------------------------------------------------
    // Document field access helpers
    // ------------------------------------------------------------------

    private List<String> readFieldValues(DocumentV2 document, List<String> paths) {
        List<String> values = new ArrayList<>(paths.size());
        for (String path : paths) {
            values.add(readFieldValue(document, path));
        }
        return values;
    }

    private String readFieldValue(DocumentV2 document, String path) {
        if (path == null) {
            return "";
        }
        // VERIFY: reading a String field value by absolute path from DocumentV2. The
        // tutorial reads via the generic API (document.field(pointer)/FieldInstanceV2
        // .value()) or typed accessors. Using a path-string read here; confirm the
        // generic accessor name (e.g. document.fieldByPath(path).map(v -> (String)
        // v.value())).
        try {
            return Optional.ofNullable(document.getStringValueByPath(path)).orElse("");
        } catch (RuntimeException e) {
            return "";
        }
    }

    // ------------------------------------------------------------------
    // Inferred model-introspection helpers (all // VERIFY)
    // ------------------------------------------------------------------

    private List<IField> allFields(IDocumentModelSearchService search) {
        // VERIFY: enumerate all fields of the model. Placeholder returns empty; wire to
        // the real model walk (search.getAllFields() / walking groups).
        return List.of();
    }

    private String fieldPath(IField field) {
        // VERIFY: absolute path of a field within the model (e.g. field.getPath() or
        // built from group ancestry). The query/update APIs expect "/Group/Field" form.
        return field.toString();
    }

    private String annotationValue(IField field, String name) {
        // VERIFY: read a named annotation value off a field. Likely:
        //   field.getAnnotations().stream()
        //        .filter(a -> name.equals(a.getName())).map(a -> a.getValue())...
        return null;
    }

    private String namespaceFor(String modelId) {
        // Map a Document Model id to its slug namespace. Convention: strip a "_DM"
        // suffix and lowercase, so "Page_DM" -> "page", "Person_DM" -> "person".
        // VERIFY: confirm this matches the model naming convention used by the wiki12
        // models, or read it from a model-level annotation instead.
        String id = modelId;
        if (id.endsWith("_DM")) {
            id = id.substring(0, id.length() - 3);
        }
        return id.toLowerCase();
    }

    private String stripSuffixToNamePart(String slug) {
        // Remove a trailing _<digits> to recover the name part for "unchanged name?"
        // comparison. "person:till_gartner_2" -> "person:till_gartner".
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

    // ------------------------------------------------------------------
    // Small value types
    // ------------------------------------------------------------------

    private record KeyField(String path, String order) {
    }

    /** A non-derived (user-editable) field: its absolute path + display label, for the change diff. */
    record EditableField(String path, String label) {
    }

    /** Resolved per-model derivation paths read from the wiki12.* annotations. */
    record ModelDerivationConfig(
            List<String> keyFieldPaths,
            String slugFieldPath,
            String searchTextFieldPath,
            List<String> searchableFieldPaths,
            String createdOnFieldPath,
            String titleFieldPath,
            String changeLogGroupPath,
            String changeDatetimePath,
            String changeSummaryPath,
            List<EditableField> editableFields) {

        boolean hasSlugTarget() {
            return slugFieldPath != null;
        }

        boolean hasSearchTextTarget() {
            return searchTextFieldPath != null;
        }

        boolean hasCreatedOnTarget() {
            return createdOnFieldPath != null;
        }

        boolean hasTitleTarget() {
            return titleFieldPath != null;
        }

        boolean hasChangeLog() {
            return changeLogGroupPath != null
                    && changeDatetimePath != null
                    && changeSummaryPath != null;
        }
    }
}
