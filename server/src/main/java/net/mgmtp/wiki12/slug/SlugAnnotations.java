package net.mgmtp.wiki12.slug;

/**
 * Names and values of the wiki12 field-level Document-Model annotations the
 * lifecycle listener reads. These are the contract between the model authors (who
 * set them in the SME / hand-authored model JSON) and the Data Service logic.
 *
 * <p>See {@code docs/a12/sample-models/document-models/Page_DM.json} for the
 * canonical usage: {@code Title} carries {@code wiki12.keyField="1"} +
 * {@code wiki12.searchable="true"}; {@code Slug} carries
 * {@code wiki12.derived="slug"}; {@code searchText} carries
 * {@code wiki12.derived="searchText"}.
 */
public final class SlugAnnotations {

    private SlugAnnotations() {
        // constants holder
    }

    /**
     * Field annotation marking a key field. Its <em>value</em> is the 1-based order
     * (as a string, e.g. {@code "1"}, {@code "2"}) in which key fields are
     * concatenated to derive the name part.
     */
    public static final String KEY_FIELD = "wiki12.keyField";

    /**
     * Field annotation marking a derived (system-written, read-only) field. Its value
     * is one of {@link #DERIVED_SLUG} or {@link #DERIVED_SEARCH_TEXT}.
     */
    public static final String DERIVED = "wiki12.derived";

    /** {@link #DERIVED} value identifying the target field for the derived slug. */
    public static final String DERIVED_SLUG = "slug";

    /** {@link #DERIVED} value identifying the target field for the searchText blob. */
    public static final String DERIVED_SEARCH_TEXT = "searchText";

    /**
     * Field annotation ({@code "true"}) marking a field whose value is concatenated
     * into the derived {@code searchText} blob.
     */
    public static final String SEARCHABLE = "wiki12.searchable";

    /** Convenience: the truthy value expected for {@link #SEARCHABLE}. */
    public static final String SEARCHABLE_TRUE = "true";

    /** The built-in / default namespace for bare (un-prefixed) names. */
    public static final String DEFAULT_NAMESPACE = "page";
}
