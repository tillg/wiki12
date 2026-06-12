# Pages and Entities are one mechanism, two vocabularies

Pages and Entities share everything structural: namespaced `<type>:<name>` slugs,
versioned data models, explicit-or-generated form models, and the migration
workflow. Rather than implement them twice, the system has **one underlying
mechanism — a typed, versioned, namespaced content item** — with a single
CRUD/slug/model/form/migrate code path.

## Decision

- A content item is `{ type, slug: <type>:<name>, id, fields }`.
- **`page` is the built-in type**: it always exists, its key field is `title`,
  and it is the default slug namespace (a bare identifier → `page:<name>`).
- **Entity types** (`person`, `film`, `location`, …) are user-defined types over
  the same mechanism.
- The word **"Page"** is kept in the domain language and UX because that is how
  users think ("create a page" vs "create a person"); `wiki12 page …` is
  ergonomic sugar over the same path as `entity --type page`. There is no
  separate Page implementation.

## Why

The Page/Entity distinction had become purely vocabulary once slugs, models,
forms, and migration were unified. Two implementations would be duplication with
a standing drift risk for no behavioral gain. One mechanism is less code and
guarantees Pages and Entities stay consistent by construction.

## Consequence

Surprising against the original "two kinds of content" framing — a reader sees
`page` handled as just another type and might expect a dedicated Page module.
The README and the `basic_setup` spec artifacts should be reworded so "Page" and
"Entity" read as vocabulary over one content-item mechanism, not two subsystems.
