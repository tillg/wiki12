package net.mgmtp.wiki12.operation;

import com.googlecode.jsonrpc4j.JsonRpcParam;
import com.mgmtp.a12.dataservices.document.DataServicesDocument;
import com.mgmtp.a12.dataservices.document.DocumentReference;
import com.mgmtp.a12.dataservices.document.persistence.IDocumentRepository;
import com.mgmtp.a12.dataservices.rpc.RemoteOperation;
import com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2;
import net.mgmtp.wiki12.slug.ModelConfigRegistry;
import net.mgmtp.wiki12.slug.ModelDerivationConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Custom JSON-RPC operation implementing slug → document resolution (ADR-0001,
 * "try-ID-then-slug"). The web client and CLI resolve Technical-ID / docRef-form refs
 * themselves and only call this op for an actual slug (e.g. {@code person:till_gartner}
 * or a bare {@code till_gartner} defaulting to the {@code page} namespace).
 *
 * <p>Returns {@code {type, id, slug, docRef, found}} — the shape the web client's
 * {@code resolveRef} and the CLI's {@code resolveDocRef} consume.
 *
 * <p>Implementation: scans the target model's documents via {@link IDocumentRepository}
 * and matches the derived {@code slug} field (path from {@link ModelConfigRegistry}).
 * This avoids the projection-row extraction of the Query API; slug sets per model are
 * small for a wiki. Registered via {@code mgmtp.a12.dataservices.jsonRpc.allowedOperations}.
 */
@RemoteOperation(name = ResolveBySlugOperation.RESOLVE_BY_SLUG)
@Component
public class ResolveBySlugOperation {

    public static final String RESOLVE_BY_SLUG = "ResolveBySlug";
    private static final String DEFAULT_NAMESPACE = "page";

    private static final Logger log = LoggerFactory.getLogger(ResolveBySlugOperation.class);

    private final IDocumentRepository documentRepository;
    private final ModelConfigRegistry registry;

    public ResolveBySlugOperation(IDocumentRepository documentRepository, ModelConfigRegistry registry) {
        this.documentRepository = documentRepository;
        this.registry = registry;
    }

    public Map<String, Object> rpc(@JsonRpcParam("idOrSlug") String idOrSlug,
                                   @JsonRpcParam(value = "type") String type) {
        log.debug("{} idOrSlug={} type={}", RESOLVE_BY_SLUG, idOrSlug, type);

        // A docRef-form ref (Model_DM/<id>) needs no lookup — split and return it.
        int slash = idOrSlug.indexOf('/');
        if (slash > 0 && idOrSlug.substring(0, slash).endsWith("_DM")) {
            return found(idOrSlug.substring(0, slash), idOrSlug.substring(slash + 1), idOrSlug);
        }
        // (slug branch below)

        String slug = idOrSlug.contains(":") ? idOrSlug : DEFAULT_NAMESPACE + ":" + idOrSlug;
        String modelId = (type != null && !type.isBlank()) ? type : modelForNamespace(slug);

        ModelDerivationConfig config = registry.forModel(modelId);
        if (config == null) {
            return notFound(slug);
        }
        String slugPath = config.slugFieldPath();

        for (DocumentReference ref : documentRepository.findAllDocRefsForModel(modelId)) {
            DataServicesDocument dsDoc = documentRepository.findByDocumentReference(ref).orElse(null);
            if (dsDoc == null) {
                continue;
            }
            DocumentV2 doc = dsDoc.getKernelDocument();
            if (slug.equals(safeFieldValue(doc, slugPath))) {
                return found(modelId, bareId(doc.getId().orElse(ref.toString())), slug);
            }
        }
        return notFound(slug);
    }

    private static Object safeFieldValue(DocumentV2 doc, String path) {
        try {
            return doc.fieldValue(path);
        } catch (RuntimeException e) {
            return null;
        }
    }

    /** A12 getId()/DocumentReference may be the full "Model_DM/<uuid>" docRef; keep only the uuid. */
    private static String bareId(String rawId) {
        int slash = rawId.lastIndexOf('/');
        return slash < 0 ? rawId : rawId.substring(slash + 1);
    }

    private Map<String, Object> found(String modelId, String id, String slug) {
        Map<String, Object> r = new HashMap<>();
        r.put("found", true);
        r.put("type", modelId);
        r.put("id", id);
        r.put("slug", slug);
        r.put("docRef", modelId + "/" + id);
        return r;
    }

    private Map<String, Object> notFound(String slug) {
        Map<String, Object> r = new HashMap<>();
        r.put("found", false);
        r.put("slug", slug);
        return r;
    }

    /** "page:foo" → "Page_DM", "person:bar" → "Person_DM". */
    private String modelForNamespace(String slug) {
        String ns = slug.substring(0, slug.indexOf(':'));
        return Character.toUpperCase(ns.charAt(0)) + ns.substring(1) + "_DM";
    }
}
