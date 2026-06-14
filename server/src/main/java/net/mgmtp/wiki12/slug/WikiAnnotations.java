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
public final class WikiAnnotations {

    private WikiAnnotations() {
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
     * {@link #DERIVED} value identifying the {@code CreatedOn} field — a
     * {@code DateTimeType} stamped once at create and never on update (the standard
     * content envelope, see {@code specs/changes/mandatory-content-fields/}).
     */
    public static final String DERIVED_CREATED_ON = "createdOn";

    /**
     * {@link #DERIVED} value identifying the derived display {@code Title} field —
     * derived (human-readable) from the key fields. Present only on models whose key
     * fields are not themselves an authored title.
     */
    public static final String DERIVED_TITLE = "title";

    /**
     * {@link #DERIVED} value identifying the repeatable {@code Changes} group — the
     * append-only change log; one entry is appended per write.
     */
    public static final String DERIVED_CHANGE_LOG = "changeLog";

    /**
     * Field annotation marking a field inside the {@link #DERIVED_CHANGE_LOG} group.
     * Its value is one of {@link #CHANGE_FIELD_DATETIME} or {@link #CHANGE_FIELD_SUMMARY}.
     */
    public static final String CHANGE_FIELD = "wiki12.changeField";

    /** {@link #CHANGE_FIELD} value: the change-entry timestamp ({@code DateTimeType}). */
    public static final String CHANGE_FIELD_DATETIME = "datetime";

    /** {@link #CHANGE_FIELD} value: the change-entry summary ({@code StringType}). */
    public static final String CHANGE_FIELD_SUMMARY = "summary";

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
