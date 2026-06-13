// Help text for the wiki12 CLI. Every command + subcommand exposes -h/--help.

export const TOP_LEVEL_HELP = `wiki12 — A12 wiki CLI (content CRUD, models, forms, migrations)

Usage:
  wiki12 <command> [subcommand] [args] [flags]

Commands:
  search   <query> [--kind page|entity] [--type <type>]
               Unified search across all content.
  page     list|create|read|update|delete|search <id-or-slug>
               Page content CRUD (sugar for: entity --type page).
  entity   list|create|read|update|delete|search --type <type> <id-or-slug>
               Entity content CRUD for any type.
  model    list|create|read|update <type>
               Data-model management (model-lifecycle service).
  form     list|create|read|update <type>
               Form-model management (model-lifecycle service).
  migrate  <type> --from <v> --to <v> [--dry-run]
               Run a stored migration (model-lifecycle service).

Items are addressable by EITHER Technical ID or slug. A bare name resolves in
the "page:" namespace. Slugs are read-only and system-derived; an update that
changes a slug prints a clear old -> new message.

Environment:
  WIKI12_DATA_SERVICE_URL      Data Service base URL (default http://localhost:8082)
  WIKI12_MODEL_LIFECYCLE_URL   Model-lifecycle base URL (default http://localhost:8090)

Run "wiki12 <command> -h" for command-specific help.`;

export const HELP: Record<string, string> = {
  search: `wiki12 search <query> [--kind page|entity] [--type <type>]

Unified search across all content (the page type + every entity type). Calls
the Data Service custom op UnifiedSearch. Returns typed hits (kind, type, id,
slug, title, snippet).

Flags:
  --kind page|entity   Restrict to pages or entities.
  --type <type>        Restrict to a single content type (implies a kind).`,

  page: `wiki12 page <subcommand> [args]

Page content CRUD. Sugar for "wiki12 entity --type page ...".

Subcommands:
  list                       List pages.
  create [--field k=v ...]   Create a page.
  read   <id-or-slug>        Read a page by Technical ID or slug.
  update <id-or-slug> [--field k=v ...]
                             Update a page; prints old -> new if the slug changes.
  delete <id-or-slug>        Delete a page.
  search <query>             Search within pages (filtered UnifiedSearch).

Items are addressable by Technical ID or slug; a bare name is page:<name>.`,

  entity: `wiki12 entity <subcommand> --type <type> [args]

Entity content CRUD for a user-defined type.

Subcommands:
  list                       List entities of --type.
  create [--field k=v ...]   Create an entity.
  read   <id-or-slug>        Read an entity by Technical ID or slug.
  update <id-or-slug> [--field k=v ...]
                             Update an entity; prints old -> new if slug changes.
  delete <id-or-slug>        Delete an entity.
  search <query>             Search within --type (filtered UnifiedSearch).

Flags:
  --type <type>   Required. The entity type (e.g. person, film, location).`,

  model: `wiki12 model <subcommand> <type>

Data-model management via the model-lifecycle service.

Subcommands:
  list                       List data models.
  create <type> [--file <path>]
                             Upload a new data model.
  read   <type>              Read a data model.
  update <type> [--file <path>] [--migration <path>] [--to-version <v>]
                             Upload a model + its Migration together (gated:
                             a version bump requires the matching migration).

No delete in baseline (destructive model removal is out of scope).`,

  form: `wiki12 form <subcommand> <type>

Form-model management via the model-lifecycle service. A type with no explicit
form model gets a generated default.

Subcommands:
  list                       List form models.
  create <type> [--file <path>]   Upload a form model.
  read   <type>              Read the form model for <type>.
  update <type> [--file <path>]   Replace the form model for <type>.`,

  migrate: `wiki12 migrate <type> --from <v> --to <v> [--dry-run]

Ask the model-lifecycle service to run a stored migration.

Flags:
  --from <v>    Source model version (required).
  --to <v>      Target model version (required).
  --dry-run     Report without writing, including the slug-change manifest.`,
};
