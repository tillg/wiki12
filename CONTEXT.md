# wiki12

A wiki-style application built on the A12 model-driven platform. It manages two
kinds of content — Pages and typed Entities — over a shared A12 Data Service,
reached from both a web client and the `wiki12` CLI.

## Language

### Content

**Content item**:
The single underlying mechanism — `{ type, slug, id, fields }` — that both Pages
and Entities are. Typed, versioned, namespaced; one CRUD/slug/model/form/migrate
path. "Page" and "Entity" are vocabulary over this one mechanism, not separate
implementations.
_Avoid_: Document, record (when you mean the general mechanism).

**Page**:
A Content item of the built-in **`page`** type — a `title`, a markdown `body`, a
Technical ID, and a derived Slug (`page:albert_einstein`). The `page` type
**always exists** in every wiki12 instance and is the default Slug namespace (a
bare identifier resolves as `page:<name>`). `wiki12 page …` is sugar for
`entity --type page …`.
_Avoid_: Article, document, post.

**Entity**:
A Content item of a user-defined Entity Type — with type-specific fields, a
markdown description, a Technical ID, and a namespaced Slug.
_Avoid_: Record, object, node.

**Entity Type**:
A user-defined content type — `person`, `film`, `location`, … Each type is its
own Data Model and supplies the `<type>` prefix of the Slug. (`page` is the
built-in type; Entity Types are the ones users add.)
_Avoid_: Kind, class, category.

### Identity

Either identifier resolves an item: anywhere a Page or Entity must be named
(CLI argument, API path, link), both its Technical ID and its Slug are accepted
and refer to the same item. A Slug given without a `<type>:` prefix defaults to
the `page` namespace.

**Technical ID**:
The opaque, system-generated, stable unique identifier of a Page or Entity. The
target of all references and persistence; never the primary human handle.
_Avoid_: PK, UUID, key (when you mean the ID).

**Slug**:
The read-only, system-maintained human handle. Every Slug is namespaced
`<type>:<name>` (`page:albert_einstein`, `person:till_gartner`), derived from the
item's Key Fields. Format: lowercase, `<name>` characters `[a-z0-9_]` with `_` as
the word separator (`Till Gartner` → `till_gartner`); `:` is the reserved
namespace delimiter. `page` is the default namespace — a bare `<name>` with no
`<type>:` resolves as `page:<name>`. Globally unique: collisions get a sticky
numeric suffix (`person:till_gartner_2`) fixed at creation. Therefore `slug =
f(Key Fields, creation order)` — it is stored state, not a pure recomputation of
the current Key Fields. Users never edit it; when an edit to a Key Field changes
it, the change is surfaced to the user.
_Avoid_: Permalink, handle, URL key.

**Key Fields**:
The fields a Slug is derived from (Page: title; person: first + last name; per
Entity Type). Editing a Key Field can change the Slug.
_Avoid_: Natural key, business key.

### Models

**Data Model**:
The versioned structural definition of a content type (fields, types,
constraints). One for Page, one per Entity Type.
_Avoid_: Schema, type definition.

**Form Model**:
The presentation/editing definition for a Data Model (layout, widgets,
validation). Auto-generated from the Data Model when none is supplied — so every
type is always editable.
_Avoid_: View, UI schema, layout.

**Migration**:
A TypeScript script that transforms existing instances from Data Model version N
to N+1. No model version bump ships without its Migration.
_Avoid_: Upgrade script, transform, patch.

### Platform

**Data Service**:
The standard A12 (Java) backend providing model-driven CRUD and search over the
Data Models, backed by PostgreSQL. The single boundary where slug derivation and
uniqueness are enforced; both web and CLI go through it.
_Avoid_: API server, backend (when you mean specifically the A12 Data Service).
