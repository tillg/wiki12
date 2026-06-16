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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Custom JSON-RPC operation: search across all wiki12 content models by the derived
 * {@code searchText} blob, returning a merged hit list
 * {@code [{kind, type, id, slug, title, snippet}]} (the shape the {@code wiki12 search}
 * CLI consumes). The web client does its own batched stock-QUERY fan-out, so this op
 * is primarily for the CLI.
 *
 * <p>Implementation mirrors {@link ResolveBySlugOperation}: scan documents via
 * {@link IDocumentRepository} and filter in Java (a wiki's content set is small).
 * Registered via {@code mgmtp.a12.dataservices.jsonRpc.allowedOperations}.
 */
@RemoteOperation(name = UnifiedSearchOperation.UNIFIED_SEARCH)
@Component
public class UnifiedSearchOperation {

    public static final String UNIFIED_SEARCH = "UnifiedSearch";
    private static final int SNIPPET_LEN = 160;

    private static final Logger log = LoggerFactory.getLogger(UnifiedSearchOperation.class);

    private final IDocumentRepository documentRepository;
    private final ModelConfigRegistry registry;

    public UnifiedSearchOperation(IDocumentRepository documentRepository, ModelConfigRegistry registry) {
        this.documentRepository = documentRepository;
        this.registry = registry;
    }

    public List<Map<String, Object>> rpc(@JsonRpcParam("query") String query,
                                         @JsonRpcParam(value = "kind") String kind,
                                         @JsonRpcParam(value = "type") String type) {
        log.debug("{} query={} kind={} type={}", UNIFIED_SEARCH, query, kind, type);
        String needle = query == null ? "" : query.trim().toLowerCase();
        List<Map<String, Object>> hits = new ArrayList<>();
        if (needle.isEmpty()) {
            return hits;
        }

        for (String modelId : registry.contentModelIds()) {
            String t = typeOf(modelId);
            String k = "Page_DM".equals(modelId) ? "page" : "entity";
            if (type != null && !type.isBlank() && !type.equalsIgnoreCase(t)) {
                continue;
            }
            if (kind != null && !kind.isBlank() && !kind.equalsIgnoreCase(k)) {
                continue;
            }
            ModelDerivationConfig config = registry.forModel(modelId);
            for (DocumentReference ref : documentRepository.findAllDocRefsForModel(modelId)) {
                DataServicesDocument dsDoc = documentRepository.findByDocumentReference(ref).orElse(null);
                if (dsDoc == null) {
                    continue;
                }
                DocumentV2 doc = dsDoc.getKernelDocument();
                String searchText = str(fieldValue(doc, config.searchTextFieldPath()));
                if (!searchText.toLowerCase().contains(needle)) {
                    continue;
                }
                String rawId = doc.getId().orElse(ref.toString());
                int sl = rawId.lastIndexOf('/');
                String id = sl < 0 ? rawId : rawId.substring(sl + 1);
                Map<String, Object> hit = new HashMap<>();
                hit.put("kind", k);
                hit.put("type", t);
                hit.put("id", id);
                hit.put("slug", str(fieldValue(doc, config.slugFieldPath())));
                hit.put("title", title(doc, config));
                hit.put("snippet", snippet(searchText));
                hits.add(hit);
            }
        }
        return hits;
    }

    private String title(DocumentV2 doc, ModelDerivationConfig config) {
        if (config.titleFieldPath() != null) {
            String t = str(fieldValue(doc, config.titleFieldPath()));
            if (!t.isEmpty()) {
                return t;
            }
        }
        if (!config.keyFieldPaths().isEmpty()) {
            return str(fieldValue(doc, config.keyFieldPaths().get(0)));
        }
        return "";
    }

    private static String snippet(String searchText) {
        return searchText.length() <= SNIPPET_LEN ? searchText : searchText.substring(0, SNIPPET_LEN) + "…";
    }

    private static Object fieldValue(DocumentV2 doc, String path) {
        if (path == null) {
            return null;
        }
        try {
            return doc.fieldValue(path);
        } catch (RuntimeException e) {
            return null;
        }
    }

    private static String str(Object v) {
        return v == null ? "" : v.toString();
    }

    private static String typeOf(String modelId) {
        String t = modelId.endsWith("_DM") ? modelId.substring(0, modelId.length() - 3) : modelId;
        return t.toLowerCase();
    }
}
