package net.mgmtp.wiki12.slug;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

/**
 * Reads the wiki12 derivation config for each content model straight from the
 * mounted Document Model JSON (the format wiki12 authors and validates in
 * {@code src/model_tools}), instead of A12's model-introspection API.
 *
 * <p>Rationale (ADR-0001, autonomous decision D3): the A12 model-walk API
 * (enumerate fields / read annotations / field paths) was the riskiest unknown in
 * the original stub. wiki12 owns the DM JSON format, so parsing it directly is
 * deterministic and offline-testable. Field paths follow the A12 document path
 * convention {@code /<RootGroup>/<Field>} (change-log children one level deeper).
 */
@Component
public class ModelConfigRegistry {

    private static final Logger log = LoggerFactory.getLogger(ModelConfigRegistry.class);

    /** Where docker-compose mounts the document models (see docker-compose.yml). */
    private static final Path MODELS_DIR = Path.of("/opt/wiki12/models/document-models");

    private final Map<String, ModelDerivationConfig> byModelId = new HashMap<>();
    private final ObjectMapper mapper = new ObjectMapper();

    public ModelConfigRegistry() {
        loadAll();
    }

    /** The derivation config for a model id (e.g. {@code Page_DM}), or {@code null} if not a wiki12 content model. */
    public ModelDerivationConfig forModel(String modelId) {
        return byModelId.get(modelId);
    }

    /** All wiki12 content model ids that carry the envelope (have a derived slug). */
    public java.util.Set<String> contentModelIds() {
        return java.util.Collections.unmodifiableSet(byModelId.keySet());
    }

    private void loadAll() {
        if (!Files.isDirectory(MODELS_DIR)) {
            log.warn("wiki12: models dir {} not found — envelope derivation disabled", MODELS_DIR);
            return;
        }
        try (Stream<Path> files = Files.list(MODELS_DIR)) {
            files.filter(p -> p.toString().endsWith(".json")).forEach(this::loadOne);
        } catch (IOException e) {
            throw new UncheckedIOException("wiki12: cannot list " + MODELS_DIR, e);
        }
        log.info("wiki12: loaded derivation config for {} content model(s): {}",
                byModelId.size(), byModelId.keySet());
    }

    private void loadOne(Path file) {
        try {
            JsonNode dm = mapper.readTree(file.toFile());
            String modelId = dm.path("header").path("id").asText(null);
            if (modelId == null) {
                return;
            }
            JsonNode rootGroups = dm.path("content").path("modelRoot").path("rootGroups");
            if (!rootGroups.isArray() || rootGroups.isEmpty()) {
                return;
            }
            JsonNode root = rootGroups.get(0);
            String rootName = root.path("name").asText();
            String rootPath = "/" + rootName;

            List<KeyField> keyFields = new ArrayList<>();
            List<String> searchablePaths = new ArrayList<>();
            List<EditableField> editableFields = new ArrayList<>();
            String slugPath = null;
            String searchTextPath = null;
            String createdOnPath = null;
            String titlePath = null;
            String changeLogGroupPath = null;
            String changeDatetimePath = null;
            String changeSummaryPath = null;

            JsonNode elements = root.path("Group").path("elements");
            for (JsonNode el : elements) {
                String type = el.path("type").asText();
                String name = el.path("name").asText();
                String path = rootPath + "/" + name;
                String derived = annotation(el, WikiAnnotations.DERIVED);

                if ("Group".equals(type)) {
                    // The change-log group: find its datetime/summary child fields.
                    if (WikiAnnotations.DERIVED_CHANGE_LOG.equals(derived)) {
                        changeLogGroupPath = path;
                        for (JsonNode child : el.path("Group").path("elements")) {
                            String cf = annotation(child, WikiAnnotations.CHANGE_FIELD);
                            String childPath = path + "/" + child.path("name").asText();
                            if (WikiAnnotations.CHANGE_FIELD_DATETIME.equals(cf)) {
                                changeDatetimePath = childPath;
                            } else if (WikiAnnotations.CHANGE_FIELD_SUMMARY.equals(cf)) {
                                changeSummaryPath = childPath;
                            }
                        }
                    }
                    continue;
                }
                if (!"Field".equals(type)) {
                    continue;
                }

                String keyOrder = annotation(el, WikiAnnotations.KEY_FIELD);
                if (keyOrder != null) {
                    keyFields.add(new KeyField(path, keyOrder));
                }
                if (WikiAnnotations.SEARCHABLE_TRUE.equals(annotation(el, WikiAnnotations.SEARCHABLE))) {
                    searchablePaths.add(path);
                }
                if (WikiAnnotations.DERIVED_SLUG.equals(derived)) {
                    slugPath = path;
                } else if (WikiAnnotations.DERIVED_SEARCH_TEXT.equals(derived)) {
                    searchTextPath = path;
                } else if (WikiAnnotations.DERIVED_CREATED_ON.equals(derived)) {
                    createdOnPath = path;
                } else if (WikiAnnotations.DERIVED_TITLE.equals(derived)) {
                    titlePath = path;
                } else if (derived == null) {
                    // user-editable field — tracked for the change-log diff (key fields included)
                    editableFields.add(new EditableField(path, name));
                }
            }

            keyFields.sort(Comparator.comparing(KeyField::order));
            List<String> keyPaths = keyFields.stream().map(KeyField::path).toList();

            ModelDerivationConfig config = new ModelDerivationConfig(rootName, keyPaths, slugPath,
                    searchTextPath, searchablePaths, createdOnPath, titlePath, changeLogGroupPath,
                    changeDatetimePath, changeSummaryPath, editableFields);
            if (config.hasSlugTarget()) {
                byModelId.put(modelId, config);
            }
        } catch (IOException e) {
            log.warn("wiki12: failed to read model JSON {} — skipping", file, e);
        }
    }

    private String annotation(JsonNode element, String name) {
        for (JsonNode a : element.path("annotations")) {
            if (name.equals(a.path("name").asText())) {
                return a.path("value").asText();
            }
        }
        return null;
    }

    private record KeyField(String path, String order) {
    }
}
