package net.mgmtp.wiki12.slug;

import java.util.List;

/**
 * Resolved per-model derivation paths, read from the {@code wiki12.*} annotations in
 * the Document Model JSON by {@link ModelConfigRegistry}. All paths are A12 document
 * paths of the form {@code /<RootGroup>/<Field>} (change-log children one level deeper).
 */
public record ModelDerivationConfig(
        String rootGroupName,
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

    public boolean hasSlugTarget() {
        return slugFieldPath != null;
    }

    public boolean hasSearchTextTarget() {
        return searchTextFieldPath != null;
    }

    public boolean hasCreatedOnTarget() {
        return createdOnFieldPath != null;
    }

    public boolean hasTitleTarget() {
        return titleFieldPath != null;
    }

    public boolean hasChangeLog() {
        return changeLogGroupPath != null
                && changeDatetimePath != null
                && changeSummaryPath != null;
    }
}
