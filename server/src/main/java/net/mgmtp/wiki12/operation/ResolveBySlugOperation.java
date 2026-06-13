package net.mgmtp.wiki12.operation;

import com.googlecode.jsonrpc4j.JsonRpcParam;
import com.mgmtp.a12.dataservices.document.persistence.IDocumentRepository;
import com.mgmtp.a12.dataservices.document.persistence.DataServicesDocument;
import com.mgmtp.a12.dataservices.document.DocumentReference;
import com.mgmtp.a12.dataservices.query.QueryService;
import com.mgmtp.a12.dataservices.query.QueryRoot;
import com.mgmtp.a12.dataservices.query.constraint.matching.ExactMatchOperator;
import com.mgmtp.a12.dataservices.rpc.RemoteOperation;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

import static net.mgmtp.wiki12.operation.ResolveBySlugOperation.RESOLVE_BY_SLUG;

/**
 * Custom JSON-RPC operation implementing try-ID-then-slug resolution (ADR-0001):
 * given an id-or-slug string, first attempt {@code GET_DOCUMENT} by Technical ID; on
 * miss (or when the value is structurally a slug, not an ID) fall back to a
 * {@code QUERY exact_match} on the {@code slug} field.
 *
 * <p>Bare names (no {@code :} namespace prefix) default to the {@code page} namespace
 * ({@code albert_einstein} → {@code page:albert_einstein}).
 *
 * <p>Registered via {@code mgmtp.a12.dataservices.jsonRpc.allowedOperations} (see
 * {@code application.yaml}); idiom per
 * {@code docs/a12/overall/dev_tutorial_backend_custom_endpoint.md}.
 */
@Slf4j
@RemoteOperation(name = RESOLVE_BY_SLUG)
@Component
@RequiredArgsConstructor
public class ResolveBySlugOperation {

    public static final String RESOLVE_BY_SLUG = "ResolveBySlug";

    /**
     * The derived slug field path on every wiki12 content model.
     * VERIFY: per-model the slug field path could differ; the sample models all use
     * {@code /<Type>/Slug}. A cleaner design reads the {@code wiki12.derived="slug"}
     * field path from the model (as SlugDerivationService does). Hardcoded common path
     * here for the baseline.
     */
    private static final String DEFAULT_SLUG_FIELD_PATH = "/Page/Slug";

    private final IDocumentRepository documentRepository;
    private final QueryService queryService;

    /**
     * Resolve an id-or-slug to a document.
     *
     * @param idOrSlug a Technical ID, a namespaced slug ({@code person:till_gartner}),
     *                 or a bare name resolved in the {@code page} namespace.
     * @param type     optional content-model name to scope the slug query
     *                 ({@code Page_DM}, {@code Person_DM}, …). If omitted, the namespace
     *                 prefix of the slug selects the model.
     * @return the resolved document, or empty if neither path matches.
     */
    public Optional<DataServicesDocument> rpc(@NonNull @JsonRpcParam("idOrSlug") String idOrSlug,
                                              @JsonRpcParam("type") String type) {
        log.debug("{} called with idOrSlug={}, type={}", RESOLVE_BY_SLUG, idOrSlug, type);

        // 1) Try as a Technical ID. IDs are uppercase ULID-shaped; slugs are lowercase,
        //    so a lowercase value can never be a valid ID (ADR-0001 disjointness).
        if (looksLikeTechnicalId(idOrSlug)) {
            Optional<DataServicesDocument> byId = getById(idOrSlug);
            if (byId.isPresent()) {
                return byId;
            }
        }

        // 2) Fall back to slug resolution. Normalize bare names to the page namespace.
        String slug = idOrSlug.contains(":") ? idOrSlug : "page:" + idOrSlug;
        String modelId = type != null ? type : modelForNamespace(slug);
        return queryBySlug(modelId, slug);
    }

    private boolean looksLikeTechnicalId(String value) {
        // ADR-0001: IDs keep the ULID canonical uppercase form (e.g. "pg_01H8X...");
        // slugs are always lowercase. Treat a value with any uppercase as a possible ID.
        // VERIFY: confirm the exact Technical-ID grammar A12 assigns (prefix + ULID).
        return !value.equals(value.toLowerCase());
    }

    private Optional<DataServicesDocument> getById(String id) {
        try {
            // VERIFY: constructing a DocumentReference from the id-or "<Model>/<uuid>"
            // docRef form. GET_DOCUMENT is findByDocumentReference in the repository API
            // (dev_tutorial_backend_custom_endpoint.md). The id alone may need the model
            // prefix to form a docRef; confirm the DocumentReference factory.
            DocumentReference ref = DocumentReference.of(id);
            return documentRepository.findByDocumentReference(ref);
        } catch (RuntimeException e) {
            log.debug("ID lookup failed for {}: {}", id, e.getMessage());
            return Optional.empty();
        }
    }

    private Optional<DataServicesDocument> queryBySlug(String modelId, String slug) {
        QueryRoot queryRoot = QueryRoot.builder()
                .targetDocumentModel(modelId)
                .projectionName("document")
                .constraint(ExactMatchOperator.builder()
                        .field(slugFieldPathFor(modelId))
                        .value(slug)
                        .build())
                .build();
        try {
            // VERIFY: mapping QueryPage rows to a DocumentReference then loading the
            // document mirrors the tutorial (DocumentTreeResult::getDocRef ->
            // findDocumentsByDocRefs). Confirm the row type.
            List<DocumentReference> refs = queryService.query(queryRoot, null).getContent().stream()
                    .map(this::extractDocRef)
                    .filter(java.util.Objects::nonNull)
                    .toList();
            if (refs.isEmpty()) {
                return Optional.empty();
            }
            List<DataServicesDocument> docs = documentRepository.findDocumentsByDocRefs(refs);
            return docs.stream().findFirst();
        } catch (RuntimeException e) {
            log.debug("Slug query failed for {} / {}: {}", modelId, slug, e.getMessage());
            return Optional.empty();
        }
    }

    // VERIFY: extracting a DocumentReference from a projection row; the tutorial casts
    // to DocumentTreeResult and calls getDocRef().
    private DocumentReference extractDocRef(Object row) {
        return null;
    }

    private String modelForNamespace(String slug) {
        // "person:till_gartner" -> "Person_DM"; "page:..." -> "Page_DM".
        // VERIFY: confirm the namespace -> model-id convention against the deployed
        // models (capitalize + "_DM").
        String ns = slug.substring(0, slug.indexOf(':'));
        return Character.toUpperCase(ns.charAt(0)) + ns.substring(1) + "_DM";
    }

    private String slugFieldPathFor(String modelId) {
        // VERIFY: the slug field path per model. Sample models use "/<Type>/Slug".
        if ("Page_DM".equals(modelId)) {
            return DEFAULT_SLUG_FIELD_PATH;
        }
        String type = modelId.endsWith("_DM") ? modelId.substring(0, modelId.length() - 3) : modelId;
        return "/" + type + "/Slug";
    }
}
