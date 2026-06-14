import net.mgmtp.wiki12.slug.Slugifier;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Framework-free test harness for {@link Slugifier}. Run with:
 *
 * <pre>
 *   cd server
 *   javac -d /tmp/wiki12-slugtest \
 *       src/main/java/net/mgmtp/wiki12/slug/Slugifier.java \
 *       test/SlugifierTest.java
 *   java -cp /tmp/wiki12-slugtest SlugifierTest
 * </pre>
 *
 * Exits non-zero on the first failure so it doubles as a CI gate.
 */
public final class SlugifierTest {

    private static int passed = 0;
    private static int failed = 0;

    public static void main(String[] args) {
        // --- slugify ---
        eq("slugify lowercases + spaces->_", "till_gartner", Slugifier.slugify("Till Gartner"));
        eq("slugify collapses runs + strips punct", "albert_einstein",
                Slugifier.slugify("Albert  Einstein!"));
        eq("slugify strips leading/trailing", "foo_bar",
                Slugifier.slugify("  Foo --- Bar  "));
        eq("slugify collapses repeats", "a_b", Slugifier.slugify("a___b"));
        eq("slugify keeps digits", "page_42", Slugifier.slugify("Page 42"));
        eq("slugify all-punct -> empty", "", Slugifier.slugify("!!! ??? ..."));
        eq("slugify null -> empty", "", Slugifier.slugify(null));
        eq("slugify already-clean unchanged", "till_gartner",
                Slugifier.slugify("till_gartner"));
        // ADR-0001 defines the name part as [a-z0-9_]; any non-ASCII letter is a
        // non-[a-z0-9] char and is therefore dropped (collapses to a separator).
        // "café" -> "caf" (the accented e is removed, leaving no trailing separator).
        // NOTE: there is NO transliteration/Unicode-fold in the baseline rule, so
        // "café" does NOT become "cafe". If accent-folding is wanted later, normalize
        // (NFD + strip combining marks) before slugify — see // VERIFY in README.
        eq("slugify non-ascii letter dropped (no transliteration)", "caf",
                Slugifier.slugify("café"));
        eq("slugify mid-word non-ascii splits", "na_ve", Slugifier.slugify("naïve"));

        // --- namespacedSlug ---
        eq("namespacedSlug page", "page:albert_einstein",
                Slugifier.namespacedSlug("page", "Albert Einstein"));
        eq("namespacedSlug person", "person:till_gartner",
                Slugifier.namespacedSlug("person", "Till Gartner"));

        // --- withSuffix ---
        eq("withSuffix n=1 is bare", "person:till_gartner",
                Slugifier.withSuffix("person:till_gartner", 1));
        eq("withSuffix n=0 is bare", "person:till_gartner",
                Slugifier.withSuffix("person:till_gartner", 0));
        eq("withSuffix n=2 sticky on name", "person:till_gartner_2",
                Slugifier.withSuffix("person:till_gartner", 2));
        eq("withSuffix n=3", "page:albert_einstein_3",
                Slugifier.withSuffix("page:albert_einstein", 3));

        // --- deriveName ---
        eq("deriveName single", "till_gartner",
                Slugifier.deriveName(Collections.singletonList("Till Gartner")));
        eq("deriveName joins key fields", "albert_einstein_physicist",
                Slugifier.deriveName(Arrays.asList("Albert Einstein", "Physicist")));
        eq("deriveName skips empty/null", "first_last",
                Slugifier.deriveName(Arrays.asList("First", "", null, "Last")));
        eq("deriveName empty list -> empty", "", Slugifier.deriveName(Collections.<String>emptyList()));

        // --- searchText ---
        eq("searchText lowercases + collapses ws", "albert einstein physicist",
                Slugifier.searchText(Arrays.asList("Albert  Einstein", "Physicist")));
        eq("searchText preserves punctuation", "e=mc^2 is famous!",
                Slugifier.searchText(Arrays.asList("E=mc^2", "is famous!")));
        eq("searchText skips empties", "a b",
                Slugifier.searchText(Arrays.asList("A", "", null, "B")));
        eq("searchText empty list -> empty", "", Slugifier.searchText(Collections.<String>emptyList()));

        // --- displayTitle (the human Title envelope field) ---
        eq("displayTitle joins with space, keeps case", "Till Gartner",
                Slugifier.displayTitle(Arrays.asList("Till", "Gartner")));
        eq("displayTitle single value", "Albert Einstein",
                Slugifier.displayTitle(Collections.singletonList("Albert Einstein")));
        eq("displayTitle skips empty/null/blank", "First Last",
                Slugifier.displayTitle(Arrays.asList("First", "", null, "  ", "Last")));
        eq("displayTitle trims + collapses inner ws", "The Matrix",
                Slugifier.displayTitle(Arrays.asList("  The   Matrix  ")));
        eq("displayTitle empty list -> empty", "",
                Slugifier.displayTitle(Collections.<String>emptyList()));

        // --- updateSummary + SUMMARY_CREATED (the Changes log) ---
        eq("create summary constant", "created", Slugifier.SUMMARY_CREATED);
        eq("updateSummary empty -> bare", "updated",
                Slugifier.updateSummary(Collections.<String>emptyList()));
        eq("updateSummary single label", "updated: Title",
                Slugifier.updateSummary(Collections.singletonList("Title")));
        eq("updateSummary sorts for stability", "updated: Body, Title",
                Slugifier.updateSummary(Arrays.asList("Title", "Body")));
        eq("updateSummary drops blanks", "updated: Name",
                Slugifier.updateSummary(Arrays.asList("Name", "", null, "  ")));
        eq("updateSummary all-blank -> bare", "updated",
                Slugifier.updateSummary(Arrays.asList("", null, "  ")));

        // --- end-to-end: derive then namespace then suffix ---
        String name = Slugifier.deriveName(Collections.singletonList("Till Gartner"));
        String slug = Slugifier.withSuffix("person:" + name, 2);
        eq("end-to-end sticky suffix", "person:till_gartner_2", slug);

        System.out.println();
        System.out.println("SlugifierTest: " + passed + " passed, " + failed + " failed");
        if (failed > 0) {
            System.exit(1);
        }
    }

    private static void eq(String label, String expected, String actual) {
        if (expected.equals(actual)) {
            passed++;
            System.out.println("  PASS  " + label);
        } else {
            failed++;
            System.out.println("  FAIL  " + label
                    + "\n          expected: [" + expected + "]"
                    + "\n          actual:   [" + actual + "]");
        }
    }
}
