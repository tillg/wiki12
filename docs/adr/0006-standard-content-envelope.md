# Every content item carries a standard envelope

Beyond its type-specific fields, every content item carries three standard,
system-maintained fields: **CreatedOn**, a display **Title**, and an append-only
**Changes** log — alongside the existing derived `slug`/`searchText`. Together
these are the **content envelope**: the type-independent surface generic code
(search rows, listings, audit) relies on without knowing the type.

This extends ADR-0001 ("derivation lives only in the Data Service"): the envelope
is derived by the same `WikiContentLifecycleListener` in the write transaction,
not by a new component.

## Decision

- **CreatedOn** (`DateTimeType`, `wiki12.derived="createdOn"`) — stamped once at
  create, never on update. Immutable: written by the server, never present in a
  client write payload, so a client cannot set or overwrite it.
- **Title** (`StringType`) — a uniform display label on every type. Authored where
  the type already has a title key field (`page`, `film`); a derived, read-only
  field (`wiki12.derived="title"`) computed from the key fields where it does not
  (`person` → `FirstName LastName`, `location` → `Name`). The contract is uniform
  (every model has a `Title`); the mechanism differs per type.
- **Changes** — a repeatable Group (`wiki12.derived="changeLog"`) of
  `{ ChangedOn, Summary }` entries (`wiki12.changeField` = `datetime`/`summary`).
  The listener appends exactly one entry per write: `created` on create,
  `updated: <changed field labels>` on update (auto-generated, not user-authored).
- **Derivation** is shared with slug/searchText: pure parts in `Slugifier`
  (`displayTitle`, `updateSummary`), A12-bound parts in the renamed
  `ContentDerivationService`. Derived fields are excluded from generated edit
  forms; the View screen surfaces them read-only.
- **Enforcement**: every content model must carry the envelope — checked by the
  offline validator (`src/model_tools/validate.py`, CI) and by the model-lifecycle
  `POST /models` upload gate (runtime, 409). A12's `IModelRepository` model-CRUD
  hook is the native fallback if models ever bypass the gate (not adopted now).
- **Versioning**: adding the envelope is content-schema `v1 → v2`, gated per
  ADR-0003 by a shipped (type-agnostic) migration that backfills CreatedOn + seeds
  a Change entry.

## Why

The baseline had no uniform audit surface ("when created? what changed?") and no
single display label across types (Page has `Title`, Person has names). Without a
shared envelope, generic UI and audit must be written per type. Deriving it in the
existing listener — rather than a new audit subsystem — keeps it clean within A12
(native `DateTimeType`, repeatable Group, field annotations) and consistent by
construction with slug/searchText.

## Consequence

- First use of A12 group **repeatability** in wiki12 (the Changes log) — a new
  `UpdateAction` shape for appending a repetition, carried as `// VERIFY` until
  confirmed against a live stack (see `server/README.md` envelope E1–E4).
- `Title` is intentionally non-uniform in mechanism (authored vs derived); a
  page/film title is source, not derivable, so those keep their authored field.
- The change Summary is a field-name diff, not a semantic note. A richer
  user-authored note (`wiki12.changeField="note"`) is a clean future extension
  without reworking this.
- `SlugDerivationService`/`SlugAnnotations` are renamed
  `ContentDerivationService`/`WikiAnnotations` to match the widened role.
