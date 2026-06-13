package net.mgmtp.wiki12.slug;

import java.util.List;

/**
 * Pure slug algorithm for wiki12. NO A12 dependencies — this class must compile
 * and be unit-tested on its own (see {@code server/test/SlugifierTest.java}).
 *
 * <p>Encodes the domain slug rules from CONTEXT.md / ADR-0001:
 * <ul>
 *   <li>Slugs are namespaced {@code <type>:<name>}; {@code page} is the default
 *       namespace.</li>
 *   <li>{@code <name>} is lowercase {@code [a-z0-9_]} with {@code _} as the word
 *       separator; any run of non-{@code [a-z0-9]} characters collapses to a single
 *       {@code _}, and leading/trailing {@code _} are stripped.</li>
 *   <li>Collisions get a sticky {@code _N} suffix on the NAME part
 *       ({@code person:till_gartner_2}); {@code N <= 1} renders as the bare base.</li>
 * </ul>
 *
 * <p>All methods are stateless and deterministic; uniqueness/collision state
 * (the choice of {@code N}) is owned by the caller (the write listener), not here.
 */
public final class Slugifier {

    private Slugifier() {
        // utility class
    }

    /**
     * Slugify a free-text string into the {@code <name>} grammar: lowercase, map any
     * run of non-{@code [a-z0-9]} to a single {@code _}, strip leading/trailing {@code _}.
     *
     * <pre>
     * "Till Gartner"        -> "till_gartner"
     * "Albert  Einstein!"   -> "albert_einstein"
     * </pre>
     *
     * @param text input text (may be null/blank)
     * @return the slugified name part, possibly empty if {@code text} has no
     *         alphanumeric characters
     */
    public static String slugify(String text) {
        if (text == null) {
            return "";
        }
        String lower = text.toLowerCase();
        StringBuilder sb = new StringBuilder(lower.length());
        boolean pendingSeparator = false;
        for (int i = 0; i < lower.length(); i++) {
            char c = lower.charAt(i);
            boolean alnum = (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9');
            if (alnum) {
                // Emit a single separator for any preceding run of non-alnum, but
                // never at the start (handles leading-_ strip and repeat-collapse).
                if (pendingSeparator && sb.length() > 0) {
                    sb.append('_');
                }
                pendingSeparator = false;
                sb.append(c);
            } else {
                pendingSeparator = true;
            }
        }
        // A trailing run of non-alnum left pendingSeparator=true but emits nothing,
        // so trailing "_" is implicitly stripped.
        return sb.toString();
    }

    /**
     * Build a namespaced slug {@code <type>:<slugified-name>}. The type is assumed
     * to already be a clean lowercase namespace token (e.g. {@code page}, {@code person});
     * only the name part is slugified.
     *
     * @param type the namespace (content type)
     * @param name the free-text name to slugify
     * @return {@code <type>:<slugified-name>}
     */
    public static String namespacedSlug(String type, String name) {
        return type + ":" + slugify(name);
    }

    /**
     * Apply the sticky numeric suffix to a base slug. {@code n <= 1} returns the base
     * unchanged; otherwise the suffix attaches to the NAME part (after the {@code :}),
     * yielding e.g. {@code person:till_gartner_2}.
     *
     * <p>Because the base is {@code <type>:<name>}, appending {@code _N} to the whole
     * string is equivalent to appending it to the name part (the {@code :} sits left
     * of the name), so a single append is correct.
     *
     * @param base the base namespaced slug ({@code <type>:<name>})
     * @param n    the collision ordinal (1-based)
     * @return the base for {@code n <= 1}, else {@code base + "_" + n}
     */
    public static String withSuffix(String base, int n) {
        if (n <= 1) {
            return base;
        }
        return base + "_" + n;
    }

    /**
     * Derive the {@code <name>} part from a type's ordered key-field values: join the
     * non-empty values with a single space, then slugify. Order is the caller's
     * responsibility (it reads {@code wiki12.keyField} ordering).
     *
     * @param keyFieldValues key-field values in key-field order
     * @return the slugified joined name
     */
    public static String deriveName(List<String> keyFieldValues) {
        if (keyFieldValues == null || keyFieldValues.isEmpty()) {
            return "";
        }
        StringBuilder joined = new StringBuilder();
        for (String v : keyFieldValues) {
            if (v == null || v.isEmpty()) {
                continue;
            }
            if (joined.length() > 0) {
                joined.append(' ');
            }
            joined.append(v);
        }
        return slugify(joined.toString());
    }

    /**
     * Build the {@code searchText} blob from a type's searchable field values:
     * lowercase, join with a single space, and collapse runs of whitespace to one
     * space (trimmed). Unlike {@link #slugify}, punctuation is preserved — this is a
     * substring-search blob, not a URL token.
     *
     * @param searchableValues searchable field values
     * @return the normalized, whitespace-collapsed, lowercased blob
     */
    public static String searchText(List<String> searchableValues) {
        if (searchableValues == null || searchableValues.isEmpty()) {
            return "";
        }
        StringBuilder joined = new StringBuilder();
        for (String v : searchableValues) {
            if (v == null || v.isEmpty()) {
                continue;
            }
            if (joined.length() > 0) {
                joined.append(' ');
            }
            joined.append(v);
        }
        // Lowercase, then collapse any whitespace run to a single space and trim.
        return joined.toString().toLowerCase().replaceAll("\\s+", " ").trim();
    }
}
