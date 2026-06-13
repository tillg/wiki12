package net.mgmtp.wiki12.operation;

import com.googlecode.jsonrpc4j.JsonRpcParam;
import com.mgmtp.a12.dataservices.query.QueryService;
import com.mgmtp.a12.dataservices.query.QueryRoot;
import com.mgmtp.a12.dataservices.query.constraint.search.SimpleSearchOperator;
import com.mgmtp.a12.dataservices.rpc.RemoteOperation;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static net.mgmtp.wiki12.operation.UnifiedSearchOperation.UNIFIED_SEARCH;

/**
 * Custom JSON-RPC operation implementing wiki12's unified cross-content search as a
 * batched fan-out (architecture §4, findings §3): one {@code simple_search} QUERY per
 * content model over that model's derived {@code searchText} field, merged server-side
 * into one typed result list.
 *
 * <p>Each hit is {@code {kind, type, id, slug, title, snippet}}. Optional {@code kind}
 * ({@code page} | {@code entity}) and {@code type} filters narrow which models are
 * queried — the same endpoint backs both the web search box and the CLI
 * ({@code wiki12 search}, {@code page search}, {@code entity search --type}).
 */
@Slf4j
@RemoteOperation(name = UNIFIED_SEARCH)
@Component
@RequiredArgsConstructor
public class UnifiedSearchOperation {

    public static final String UNIFIED_SEARCH = "UnifiedSearch";

    /**
     * The content models spanned by unified search and their display metadata.
     * {@code page} is the built-in kind; the rest are entity types.
     * VERIFY: this registry is hardcoded for the baseline content set. Once models are
     * runtime-deployable (ADR-0003), discover wiki12 content models dynamically (e.g.
     * by a model-level {@code wiki12.content} annotation) instead of hardcoding.
     */
    private static final List<ContentModel> CONTENT_MODELS = List.of(
            new ContentModel("Page_DM", "page", "page", "/Page/Title", "/Page/Slug", "/Page/searchText"),
            new ContentModel("Person_DM", "entity", "person", "/Person/Name", "/Person/Slug", "/Person/searchText"),
            new ContentModel("Film_DM", "entity", "film", "/Film/Title", "/Film/Slug", "/Film/searchText"),
            new ContentModel("Location_DM", "entity", "location", "/Location/Name", "/Location/Slug", "/Location/searchText"));

    private final QueryService queryService;

    /** One unified search hit. */
    public record SearchHit(String kind, String type, String id, String slug, String title, String snippet) {
    }

    /**
     * Run a unified search.
     *
     * @param query the search term (min 3 chars per the simple_search default).
     * @param kind  optional filter: {@code page} or {@code entity}.
     * @param type  optional filter: a specific content type ({@code page}, {@code person}, …).
     * @return merged, typed hits across the selected models.
     */
    public List<SearchHit> rpc(@NonNull @JsonRpcParam("query") String query,
                               @JsonRpcParam("kind") String kind,
                               @JsonRpcParam("type") String type) {
        log.debug("{} called with query={}, kind={}, type={}", UNIFIED_SEARCH, query, kind, type);

        List<SearchHit> results = new ArrayList<>();
        for (ContentModel cm : CONTENT_MODELS) {
            if (kind != null && !kind.equals(cm.kind())) {
                continue;
            }
            if (type != null && !type.equals(cm.type())) {
                continue;
            }
            results.addAll(searchModel(cm, query));
        }
        return results;
    }

    private List<SearchHit> searchModel(ContentModel cm, String query) {
        // One simple_search over the model's searchText blob. Restricting to the single
        // searchText field (rather than omitting `fields`) keeps the regex cheap and the
        // query shape identical across models (findings §3).
        QueryRoot queryRoot = QueryRoot.builder()
                .targetDocumentModel(cm.modelId())
                .projectionName("document")
                .fields(List.of(cm.titlePath(), cm.slugPath(), "/__meta/docRef"))
                .constraint(SimpleSearchOperator.builder()
                        .fields(List.of(cm.searchTextPath()))
                        .value(query)
                        .build())
                .build();

        List<SearchHit> hits = new ArrayList<>();
        try {
            // VERIFY: SimpleSearchOperator builder shape (fields/value) and the QueryPage
            // row type. simple_search exists (dataservices §"Simple Search Operator"); the
            // exact Java operator class name/builder is inferred from the ExactMatchOperator
            // pattern in dev_tutorial_backend_custom_endpoint.md.
            queryService.query(queryRoot, null).getContent().forEach(row -> {
                String id = readDocRef(row);
                String slug = readField(row, cm.slugPath());
                String title = readField(row, cm.titlePath());
                hits.add(new SearchHit(cm.kind(), cm.type(), id, slug, title, makeSnippet(title)));
            });
        } catch (RuntimeException e) {
            // One model failing must not sink the whole fan-out — log and continue.
            log.warn("Unified search failed for model {} — skipping", cm.modelId(), e);
        }
        return hits;
    }

    private String makeSnippet(String title) {
        // Baseline: the snippet is just the title; a body-excerpt snippet (highlighting
        // the match) is deferred. searchText is a normalized blob, not display text.
        return title;
    }

    // VERIFY: extracting docRef + a projected scalar field from a QueryPage row. The
    // tutorial casts rows to DocumentTreeResult and calls getDocRef(); reading a
    // projected field value is not shown. Implement against the live row type.
    private String readDocRef(Object row) {
        return null;
    }

    private String readField(Object row, String path) {
        return null;
    }

    /** Static metadata for one searchable content model. */
    private record ContentModel(
            String modelId,
            String kind,
            String type,
            String titlePath,
            String slugPath,
            String searchTextPath) {
    }
}
