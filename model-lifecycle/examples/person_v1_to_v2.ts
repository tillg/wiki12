// Worked example migration: Person content schema v1 -> v2.
//
// v2 adds a `FullName` field derived from FirstName + LastName. A migration is a
// PURE function over ONE document: (doc at v1) -> (doc at v2). The runner owns
// iteration, IO, dry-run, and reporting — this function must not do any of that.
//
// The script is stored as the `script` field of a Migration content item and is
// transpiled + sandbox-run per document by the model-lifecycle service.

interface PersonV1 {
  __meta?: Record<string, unknown>;
  Person?: {
    FirstName?: string;
    LastName?: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}

export function migrate(doc: PersonV1): PersonV1 {
  const person = doc.Person ?? {};
  const first = person.FirstName ?? "";
  const last = person.LastName ?? "";
  return {
    ...doc,
    Person: {
      ...person,
      FullName: [first, last].filter(Boolean).join(" "),
    },
  };
}

export default migrate;
