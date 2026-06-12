# Plan: basic_setup

Ordered implementation steps. Read `proposal.md`, `domain.md`, and
`architecture.md` first. Each task is sized for a single implementation step.

## 0. Understand & document A12 (research — review gate before proceeding)

Goal: before writing any code, learn how A12 actually works and capture the
findings so the rest of the plan rests on facts, not assumptions. Record results
in `specs/changes/basic_setup/findings-a12.md`.

- [ ] **Data & form models**: How do we *author*, *validate*, and *register* A12
      data models and form models? What is the file format / schema, and what
      tooling validates them (modeler, CLI, build step)?
- [ ] **Default form model generation**: Does A12 generate a default form model
      from a data model, and where (server vs. client)? How is it triggered?
- [ ] **Data Service**: How and where do we obtain the A12 Data Service (Java)?
      Distribution (Maven artifact / Docker image / source), license/access,
      version, and its config + persistence wiring to PostgreSQL.
- [ ] **Data Service API**: What is the CRUD/query contract (endpoints, payload
      shape, how models are referenced, how search is expressed)?
- [ ] **A12 Forms in React**: How do we integrate A12 Forms/widgets into a
      from-scratch React+TS app? Packages (npm registry/access), required
      providers/bootstrapping, how a form model is bound to a widget tree, and
      markdown field support.
- [ ] **Markdown as a model field type**: How do we extend A12's model
      capabilities to represent markdown fields? Is there a native rich-text/text
      type to reuse, or do we define a custom field type/format, and how does
      that flow through data model → form model → validation?
- [ ] **Markdown editor in A12 forms**: How do we integrate a markdown editor
      into an A12 form? Is there a built-in/custom widget mechanism, how is it
      bound to a markdown field, and what editor component do we wrap?
- [ ] **Versioning & migration hooks**: How does A12 represent data-model
      versions on instances, and what is the supported path to migrate instances
      across versions (informs the TS migration runner)?
- [ ] **Access**: Confirm how we get A12 artifacts and docs (registry creds,
      repo access at <https://github.com/mgm-tp>, quick-start reachability).
- [ ] **Open questions log**: capture anything unresolved as explicit risks.
- [ ] **REVIEW GATE**: present `findings-a12.md` to the user and walk through it
      together. Do not start Step 1 until the user has reviewed and approved the
      findings (and any plan adjustments they imply).

## 1. Project scaffolding & infrastructure

- [ ] Initialize the monorepo layout: `server/`, `client/`, `cli/`,
      `models/`, `migrations/`, `docker/`.
- [ ] Add `docker-compose.yml` with `postgres`, `data-service`, and `client`
      services on a shared network.
- [ ] Configure PostgreSQL service (volume, credentials via env, healthcheck).
- [ ] Provision the A12 Data Service (Java) container; wire DB connection;
      depend on healthy `postgres`.
- [ ] `docker compose up` brings up all three services and they report healthy.

## 2. Data models

- [ ] Define the `page` data model (`title`, `slug`, `body` markdown, `id`),
      versioned at v1.
- [ ] Define entity data models for `person`, `film`, `location` (common fields
      `type`, `slug`, `id`, markdown description + type-specific fields), v1.
- [ ] Register models with the Data Service; confirm generic CRUD endpoints
      respond for each model.
- [ ] Enforce slug rules server-side: page slug derived from title; entity slug
      `type:name`, globally unique.

## 3. Form models

- [ ] Confirm default form model generation works for each data model (forms
      render with no explicit form model).
- [ ] Add an explicit form model for `page` (markdown body editor layout) as the
      reference example.

## 4. Web client (React + A12 widgets)

- [ ] Scaffold the React/TS app from the A12 widgets quick start; point it at the
      Data Service.
- [ ] Implement **search** (pages + entities) over title/slug/body.
- [ ] Implement **read/view** with markdown rendering.
- [ ] Implement **create/edit** using form models (markdown editor for bodies).
- [ ] Implement **delete** with confirmation.
- [ ] Build the client into the `client` container (served static, e.g. nginx).
- [ ] Verify in a browser: search → open → edit → save → delete round-trips for
      both a Page and an Entity.

## 5. `wiki12` CLI (Node/TS)

- [ ] Scaffold the CLI with a command framework and global `-h/--help`.
- [ ] `wiki12 page create|read|update|delete|search`.
- [ ] `wiki12 entity create|read|update|delete|search --type <type>`.
- [ ] `wiki12 model create|read|update` (entity data models).
- [ ] `wiki12 form create|read|update` (form models).
- [ ] Ensure every command and subcommand has `-h` documentation; add a top-level
      usage overview.
- [ ] Verify CLI operations hit the same Data Service and stay consistent with
      the web client.

## 6. Migrations

- [ ] Define the migration convention: `migrations/<type>/<from>-<to>.ts`
      exporting a transform function.
- [ ] Implement the migration runner in the CLI: `wiki12 migrate <type>
      --from <v> --to <v> [--dry-run]`.
- [ ] Provide a worked example: bump one entity data model to v2 and ship its
      `1-2.ts` migration.
- [ ] Verify: `--dry-run` reports affected instances; a real run upgrades all v1
      instances to v2 with a summary report and no data loss.

## 7. Seed & verification

- [ ] Add a seed step (CLI or init script) creating a few sample pages and
      entities (incl. `person:till_gartner`).
- [ ] End-to-end check: fresh `docker compose up`, browse the seeded content,
      perform CRUD from both web and CLI.
- [ ] Write a short `README.md`: run instructions, CLI usage, model/migration
      workflow.

## 8. Hand-off to system description

- [ ] After apply, promote the stabilized `domain.md` and `architecture.md`
      into `specs/system/` (via `/spec:document-system`) as the project baseline.
