# Findings: A12 research (basic_setup Step 0)

Research output for the Step 0 review gate. Every claim cites the in-repo A12
documentation mirror under `docs/a12/` (geta12.com 2025.06/ext5, scraped
2026-06-12) or the A12 Widgets Showcase mirror under `docs/a12/widgets/`.

Confidence tags: **[HIGH]** explicit in docs · **[MED]** inferred from docs ·
**[LOW]** weak/absent evidence.

---

## 0. Headline: server-side extensibility gate (ADR-0002) → **GO**

**The stock A12 Data Service supports custom server-side Java logic.** All three
behaviors the wiki12 architecture rests on can live *inside* the Data Service —
no façade is required. A12 is **not** a closed black box. **[HIGH]**

The Data Service is a Spring Boot server you build and own (via the Project
Template); it exposes documented extension points:

- **Custom JSON-RPC operations / endpoints** — a Java class annotated
  `@RemoteOperation` with a public `rpc` method, registered in
  `mgmtp.a12.dataservices.jsonRpc.allowedOperations`
  (`docs/a12/overall/dev_tutorial_backend_custom_endpoint.md`;
  `docs/a12/data_services/dataservices-documentation-src.md § "Operation"`). **[HIGH]**
- **Document lifecycle hooks** — `DocumentBeforeCreateEvent`,
  `DocumentBeforeUpdateEvent`, `…After…`, `DocumentAfterLoadEvent`, etc.,
  registered via `@CommonDataServicesEventListener`. The before-write document
  is mutable and the mutation is persisted — the exact mechanism for slug
  derivation (`docs/a12/overall/dev_tutorial_backend_document_access.md`;
  `…/dev_tutorial_backend_document_manipulation.md`). **[HIGH]**
- **Injected platform APIs** — `QueryService` and `IDocumentRepository` are
  injectable into custom beans, so a write hook can query for slug collisions and
  a resolver endpoint can fetch by `docRef`
  (`docs/a12/data_services/dataservices-documentation-src.md § "IDocumentRepository"`). **[HIGH]**

**The one caveat (see §1a):** global slug uniqueness with a sticky numeric suffix
has **no built-in A12 primitive**. Recommended: a before-write listener computes
the slug inside the request transaction and closes the concurrency race with a
**transaction-scoped Postgres advisory lock** — all generic server code, no
schema change. (A DB unique index is an optional hard-guarantee fallback.) **[HIGH]**

> **Architectural consequence:** proceed with the **Data Service–hosted** branch
> of ADR-0002 (logic in-server), not the façade. ADR-0002 should be updated to
> record the gate as resolved = GO.

---

## 1a. Global field uniqueness (slug) — approach

### No built-in feature
A12 has **no built-in "globally unique field" feature**:

- In the SME model editor, "unique" only ever means model/field/group **names**
  or enumeration category names — never field *values* across documents
  (`docs/a12/sme/sme-dm-ba-docs.md`). **[HIGH]**
- The Kernel constructs `FieldValuesNotUnique` / `RepetitionNotUnique` validate
  uniqueness **within a single document** (e.g. product numbers inside one
  order), not across the collection (`docs/a12/kernel/kernel-documentation-ba-en.md`). **[HIGH]**
- The old `DOCUMENT_UNIQUENESS_ERROR_KEY` is marked *"Not used anymore, will be
  removed"* (`docs/a12/data_services/dataservices-documentation-src.md:7584`). **[HIGH]**

So enforcing global slug uniqueness is **our logic**, not a platform feature.

### A custom server op / listener *can* own this — in the request transaction
We want this generic (no per-field schema change, slug logic in server code, not
project DDL on A12's internal tables). A12 supports that:

- Custom operations **join the request's single transaction**; a custom op
  controls transactional behavior via `@Transactional`
  (`docs/a12/data_services/dataservices-documentation-src.md` §"Transaction Handling", L2123–2152). **[HIGH]**
- `DocumentBeforeCreateEvent` / `DocumentBeforeUpdateEvent` listeners fire
  **inside the write transaction, before commit**, and the document is mutable
  there — the place to compute the slug (`…:L5439, L5377`;
  `docs/a12/overall/dev_tutorial_backend_document_manipulation.md`). **[HIGH]**
- Custom code is plain Spring `@Component` beans with injected services
  (`docs/a12/overall/dev_tutorial_backend_custom_endpoint.md` L113–219). **[HIGH]**

### …but "one transaction" alone is NOT race-safe — add a lock
A single transaction gives atomicity, **not mutual exclusion**. Under Postgres
default `READ COMMITTED`, two concurrent creates of the same name both run the
collision `SELECT` (neither sees the other's uncommitted row), both insert, both
commit → duplicate. This is why the forum (topic 1214
<https://discourse.geta12.com/t/1214>) concluded *"the only way to make this
reliable is to use a database unique constraint"* — it implicitly rejects the
transaction-only check. (The forum did **not** discuss isolation/locks.) **[HIGH]**

### Recommended: before-write listener + transaction-scoped advisory lock
Keeps everything in generic server code, **no schema change, no DDL on the
`document` table**:

1. Derive the **text-part** from per-model config, **not** a Kernel computed
   field (**decided: Design B**). The slug rule lives in **field-level
   annotations**: each key field is annotated `wiki12.keyField="<order>"` (the
   field-level annotation shows in the SME — see §1-models below), and the target
   field is annotated `wiki12.derived="slug"`. The generic listener reads the
   key fields (in order), concatenates, and slugifies (lowercase, spaces/
   punctuation → `_`, strip) — slugify lives in code because the Kernel can't
   express it, and the whole pipeline stays in one tested path.
2. In the before-write listener, **first** take a Postgres transaction-scoped
   advisory lock on the slug's text-part:
   `select pg_advisory_xact_lock(hashtext('page:' || textPart))`.
   This serializes only writes touching the **same** slug text; it auto-releases
   at commit/rollback and works at any isolation level.
3. Then run the collision query → assign the sticky `_N` (keep current suffix if
   the text part is unchanged, else `max(_N)+1`) → write. All in the one
   transaction A12 already provides.

`@Transactional(isolation = SERIALIZABLE)` is **not** a clean alternative here:
A12 *starts the main transaction itself before the op runs* (L2125), and Spring
cannot raise the isolation level of a transaction it is merely joining — so the
annotation likely has no effect. The advisory lock sidesteps this. **[MED]**

### Optional hard-guarantee fallback (not required)
A **Postgres partial unique index** on A12's JSON `document` table per model
(forum: `create unique index on document (…) where model_name = 'page';`, via a
custom Liquibase changeset) makes the DB itself reject duplicates — safe even
against a writer that bypasses the listener. Downsides are exactly what we want
to avoid: project-specific DDL coupled to A12's internal storage (upgrade-fragile).
Treat as defense-in-depth only if needed.

### Open verification (the one unknown)
The advisory lock needs the listener/op to run one native SQL statement → inject
a `JdbcTemplate`/`EntityManager`/`DataSource`. A12 is a standard Spring Boot + JPA
app, so this is almost certainly available, but the docs only *show*
`QueryService`/`IDocumentRepository` injection — raw-datasource access in custom
code is **[MED] inference, not documented**. Confirm before Step 2 (candidate
forum question; not yet posted).

---

## 1. Data & form models — authoring, validation, registration

- **Data Model = A12 "Document Model"**, persisted as **JSON**, authored in the
  **Simple Model Editor (SME)** Document Model Editor; fields organized in
  groups, with validation/computation rules in the **Kernel Language** DSL
  (`docs/a12/overall/types_of_models.md`; `docs/a12/sme/sme-dm-ba-docs.md`). **[HIGH]**
- **Field/data types:** String, Number, Date/DateTime/Time/DateFragment/DateRange,
  Boolean, Confirm, Enumeration, **Custom**, Type Definition; plus Attachment and
  Multi-Select structural elements (`docs/a12/sme/sme-dm-ba-docs.md § "Data Type"`). **[HIGH]**
- **Registration/deployment:** models live in a **Workspace** and reach the Data
  Service via **Workspace deploy** ("Deploy All"); note Document Models deploy via
  the Workspace, not a per-editor button
  (`docs/a12/sme/sme-ba-docs.md § "Workspace Deployment"`). **[HIGH]**
- **Runtime form inputs:** a Document Model is consumed at runtime as
  `documentModel.json` + generated **`validation.js`**; the form engine binds
  (data model + form model + document) (`docs/a12/form_engine/formengine-documentation-bundle.md`). **[HIGH]**
- **Form Model** = UI model (also JSON) that references ≥1 Document Model; controls
  are references to fields; widget choice is derived from field type + a per-control
  "exposition" setting (e.g. `String + linebreaksPermitted → TextArea`)
  (`docs/a12/sme/sme-fm-ba-docs.md`; `docs/a12/form_engine/formengine-documentation-bundle.md § "Controls"`). **[HIGH]**

### Open issue — programmatic model authoring
The docs confirm models are JSON but publish **no formal JSON schema** and
document no path to author/validate models **outside the SME GUI** (no CLI/build
validator found in the read set). wiki12's plan assumes models + migrations are
file-based and CLI-managed — **we must confirm we can hand-author/generate the
model JSON** (inspect Project Template model files + `sme-dev-docs`/`kernel-documentation-dev`). **[MED risk]**

---

## 2. Default form model generation → **none exists outside the SME GUI** (confirmed)

Searched exhaustively — **docs mirror, mgm-tp GitHub code search, and the
Discourse forum** — for any process that generates a default form model from a
document model. Result: **the only generator anywhere is the SME's interactive
"Build Screens From Fields" action.**

- SME **"Build Screens From Fields"** — an explicit, authoring-time GUI step that
  produces an editable, stored Form Model JSON
  (`docs/a12/sme/sme-fm-ba-docs.md § "Adding a New Form Model"`). **[HIGH]**
- **No server-side / runtime default form.** The form engine always loads an
  explicit `formModel.json`; nothing auto-generates or serves a fallback form for
  a Document Model lacking a Form Model
  (`docs/a12/form_engine/formengine-documentation-bundle.md`). The CRUD module
  (`crud-core`) *renders* an existing Overview+Form model — it doesn't generate
  one (`docs/a12/crud/crud-dev-docs.md`). **[HIGH for absence]**
- **No headless/library/CLI generator.** The official build-time model tooling —
  `a12-devtools`'s `prepare-models` Gradle plugin — has tasks for validation
  codegen, model expand, **migration**, and conversion, but **no form-generation
  task**. No public engine/devtools package exposes a build-screens function; the
  forum has no topic on it (searched 2026-06). "Build Screens From Fields" exists
  **only in the SME GUI** (closed; mgm-internal source). **[HIGH for absence]**

> **Consequence — decided direction:** the proposal/domain claim that "every type
> has a *server-generated* default form model" is **false**; soften it. wiki12
> must produce its own default Form Model **at build time**. Two options: run the
> SME action once per model and commit the result, **or** write our own DM→FM
> generator (we have the FM format as ground truth in
> `docs/a12/sample-models/reference/Contact_FM.json`) — the headless equivalent of
> "Build Screens From Fields", fitting the same `model_tools` toolchain as the
> validator. The client form engine then renders (data model + form model +
> document) as normal.

---

## 3. Data Service API & search

- **Protocol:** JSON-RPC 2.0 over a single `POST /api/v2/rpc`; operations can be
  batched in one transaction (`docs/a12/overall/dev_tutorial_backend_custom_endpoint.md`;
  `docs/a12/data_services/dataservices-documentation-src.md`). **[HIGH]**
- **CRUD ops:** `ADD_DOCUMENT` (create), `GET_DOCUMENT` (read by `docRef`),
  `QUERY` (read/search), plus modify/delete ops; models referenced by name,
  instances by `docRef = "<ModelName>/<uuid>"` (`docs/a12/overall/dev_tutorial_query_migration.md`). **[HIGH]**
- **Query language:** operator tree — `exact_match`, `double_range`, `date_range`,
  `undefined_match`, **`simple_search`**, with `and`/`or`/`not` and a `has`
  relationship operator (`docs/a12/overall/dev_tutorial_query_discovering_queries.md`). **[HIGH]**
- **Substring/ILIKE search exists:** `simple_search` is a **case-insensitive
  substring** match; with no `fields` it searches **all indexed fields** of the
  target model — directly satisfies wiki12's title/slug/body search
  (`docs/a12/data_services/dataservices-documentation-src.md § "Simple Search Operator"`). **[HIGH]**
  - Caveats: min token length 3 (configurable), only **indexed** fields, no query
    parser, and it is among the **slowest** operators (regex-based) — body-field
    search on a large corpus needs index tuning. **[HIGH]**
- **Slug/ID resolution (try-ID-then-slug):** fetch by ID = `GET_DOCUMENT`; fetch by
  slug = `QUERY exact_match` on the slug field. Both stock. **[HIGH]**

### Unified cross-content search — decided: batched fan-out, merge client-side
A single `QUERY` targets **one** `targetDocumentModel`, so there is no one-call
search across unrelated models. **Decision:** wiki12 sends **one `QUERY` per
content model (`page` + each entity type) batched in a single JSON-RPC request
array** (one HTTP round-trip, one transaction); the **client merges** the
per-model result lists into the unified result set.

Each per-model query is a **uniform** `simple_search` over a derived
**`searchText`** field with a lightweight `fields: ["/__meta/docRef", …title/slug…]`
projection (returns `model|id` + display fields). `searchText` is the
search-blob twin of the slug (see §1a): the before-write listener concatenates
(normalized: lowercase/strip) every field annotated **`wiki12.searchable="true"`**
(field-level) into the indexed `searchText` field (itself marked
`wiki12.derived="searchText"`). Why a
blob rather than passing many `fields` to `simple_search`: `simple_search` is
regex-based and among the slowest operators — one field = one regex per doc
(cheaper), the query shape is identical across all models, and we control exactly
what's searchable. Tradeoffs accepted: write-side upkeep (rides the existing slug
listener) and no per-field match attribution. **[HIGH — decided]**

Rejected: a shared supertype/base Document Model (one heterogeneous query). It
would give a single query + single paging cursor, but we will **not impose an
inheritance hierarchy on the content models just for search**. Cost of fan-out we
accept: N result lists to merge and no single server-side paging cursor — the
client handles merge/paging across the lists. **[HIGH — decided]**

---

## 4. Versioning & migration

- Instances carry a `modelVersion` in `__meta` (null in sample data — confirm it
  populates on save) (`docs/a12/overall/dev_tutorial_query_discovering_queries.md`). **[HIGH/MED]**
- A12 has a **built-in server-side migration framework**: `@MigrationStep` /
  `@MigrationTask` classes, executed once and tracked in a `migration_step` table
  (`docs/a12/data_services/dataservices-documentation-src.md § "Data Migration Support"`),
  plus a model-aware `IDocumentModelMigrator`
  (`docs/a12/overall/dev_tutorial_backend_custom_endpoint.md`). **[HIGH]**
- The **Content Engine** (page-body content models) ships its **own client-side
  TS migration tool** with versioned per-element `transform` functions
  (`docs/a12/content_engine/contentengine-dev-docs.md § "Content Model Migration"`). **[HIGH]**

> **Consequence for ADR-0003 (TS migration runner in the CLI):** A12 already
> provides a **Java-side** instance migrator that runs in-server. Two viable paths:
> keep the planned **CLI/TS runner** (consistent across page+entity, Node already
> present) *or* adopt A12's built-in `@MigrationStep`. Recommend a short ADR-0003
> revisit; the TS runner remains reasonable but is no longer the *only* option.
> The Content Engine's TS migrator is precedent for the TS approach. **[MED]**

### Decided — server-side Node component owns the TS tooling

**Decision:** a **server-side Node component** (in the docker-compose stack) owns
**form-model generation and the TS migration runner**, both triggered by the
**document-model lifecycle**. The **A12 Data Service (Java) owns per-document
runtime logic** (slug derivation, the `searchText` blob, uniqueness, CRUD — §1a).
Clean split: Java = per-document runtime; Node = model-lifecycle TS tooling
(generator is a shared pure library, also reusable in the React client). **No
client owns form generation** — both the web client and the `wiki12` CLI call the
server-side path. Migrations are exposed as a **guarded operation** (dry-run →
review slug manifest → apply), not a fire-and-forget call.

- **Models are runtime-deployable** — via the app/CLI (not the web UI yet).
  Likely a single `wiki12` CLI op that **uploads a new model + its migration
  function together** (which also satisfies ADR-0003's "no version bump without
  its migration" gate at upload time).
- On doc-model **create**: generate + store the default FM if none supplied.
  On doc-model **change**: regenerate/update the FM and require the migration.

### Decided — TS migration scripts stored & injected

Runtime model deployment rules out ADR-0003's "filesystem convention
(`migrations/<type>/<from>-<to>.ts`)" — a script baked into the Node image can't
be deployed at runtime. Resolution:

- **Store as migrations-as-content-items.** A **`Migration` A12 document model**
  (`targetModel`, `fromVersion`, `toVersion`, `script` (**TS source**), …) holds
  each migration, keyed by `(model, fromVersion, toVersion)`. Reuses the Data
  Service for storage — queryable, versioned, access-controlled, **no new infra**;
  on-brand with "everything is a content item". Clients upload **TS source only**
  (the `wiki12` CLI now; possibly TS-editing in the WebApp later) — so the store
  holds TS, not pre-compiled JS.
- **The migration service owns transpile + execution.** Because a future WebApp
  TS-editor must not bypass a client-side compile, **TS→JS transpile is the
  server-side service's job** (e.g. esbuild/swc), not the CLI's. The service then
  runs the compiled function **per document in a sandbox** (`isolated-vm` or a
  locked-down worker — no fs/no net). Safe because the per-doc transform is
  **pure by design** (`(doc vN) → (doc vN+1)`; the runner owns iteration/IO/
  reporting — domain.md). Executing operator-uploaded code ⇒ **sandbox is
  mandatory**.
- **Gate at upload:** a model-version bump is rejected unless its matching
  `Migration` doc is uploaded with it (the combined `wiki12` deploy op).

This supersedes ADR-0003's filesystem detail: runner-in-CLI → runner-in-Node-
service; scripts-in-files → `Migration` docs in the Data Service; transpile in the
service (stores TS, compiles + sandbox-runs server-side). **[HIGH — decided]**

---

## 5. A12 Forms in React + the markdown editor

- **Packages** (scope `@com.mgmtp.a12.*`): `@com.mgmtp.a12.formengine/formengine-core`,
  `@com.mgmtp.a12.widgets/widgets-core`, `@com.mgmtp.a12.client/client-core`,
  `@com.mgmtp.a12.kernel/kernel-md-facade`, `@com.mgmtp.a12.utils/*`
  (`docs/a12/form_engine/formengine-documentation-bundle.md § "Getting Started"/"Artifacts"`). **[HIGH]**
- **From-scratch integration is documented** ("Non-Redux Applications"): create a
  private Redux store, `unmarshallFormModel` + `createEmptyDocument` +
  `createEngineStore({models:{formModel,documentModel,validatorProvider}, data:{document}})`,
  render `<EngineConnected/>`. Client-side validation runs on every change but is
  **non-authoritative** — full validation must also run server-side
  (`docs/a12/form_engine/formengine-documentation-bundle.md`). **[HIGH]**
- **Markdown editor — there IS a widget:** the A12 Widgets library ships a
  **Lexical-based Rich Text Editor** (`RichTextEditor` + `DefaultRichTextEditor`),
  built on the Text Field, with pre-built plugins and a custom-plugin API
  (`docs/a12/widgets/data-entry/rich-text-editor.md` and its `default` /
  `pre-built-plugins` / `plugin-creation` sub-pages). **[HIGH]**
  - The form-engine docs alone showed no built-in rich-text widget; the **Widgets
    Showcase** (now mirrored) is where it surfaced — this is why scraping the
    showcase mattered. Binding it into a form uses the documented **custom-widget
    mechanism** (annotate the control, override the `widgetMap` entry)
    (`docs/a12/form_engine/formengine-documentation-bundle.md § "Customizing Specific Elements"`;
    `docs/a12/overall/dev_tutorial_frontend_form_customization.md`). **[HIGH]**
  - We are **not** using the A12 Lexical RTE (see decision below).
- **DECIDED — markdown editor = [Milkdown](https://milkdown.dev/), store plain
  markdown in the A12 String field.** Milkdown is **ProseMirror + Remark**-based
  and **markdown-native** (reads/writes markdown directly), so the field value is
  the markdown text itself — **no Lexical↔markdown serialization** (the reason we
  pick it over A12's Lexical RTE). A12 has **no native markdown/rich-text
  data-model field type**, so the body stays a **String field**
  (`lineBreaksPermitted`); "markdown-ness" is purely a client/UI concern
  (`docs/a12/sme/sme-dm-ba-docs.md § "Data Type"`). Our sample models already model
  bodies this way. **[HIGH — decided]**
  - **Integration:** wrap Milkdown as a **custom A12 form-engine widget** (annotate
    the control → override the `widgetMap` entry), bound to the String field; the
    editor get/set its markdown string as the field value
    (`docs/a12/form_engine/formengine-documentation-bundle.md § "Customizing Specific Elements"`).
  - **Caveat to handle:** Milkdown's editable surface is a ProseMirror
    **contenteditable div**, not an `<input>/<textarea>`. The form engine only
    focus/scrolls ("jump to field" from the validation bar) elements that are
    `input/select/textarea` or a `div` with `data-role="text-output"` — so the
    wrapper must expose that `data-role` (or manage focus itself), else validation
    jump-to-field breaks (`…formengine-documentation-bundle.md § "ScrollHandler"`). **[MED]**
- **Markdown read-view rendering:** no A12 widget renders markdown; use a React
  markdown renderer (`react-markdown`, as the A12 tutorial does) or Milkdown in
  read-only mode (`docs/a12/overall/dev_tutorial_frontend_application_frame.md`). **[HIGH]**

---

## 6. Distribution, access & deployment

- **Use the official Project Template, not from-scratch.** It is the canonical
  full-stack scaffold: `client/` (React frontend), `server/app` (Data Services
  backend) + `server/init`, `compose/` (docker-compose + Keycloak + Postgres)
  (`docs/a12/project_template/project-template-documentation.md`). **[HIGH]**
  - Download: `project-template-202506.5.1.tgz` (Community); build images with
    `gradle buildImagesComposeUp`. **[HIGH]**
- **docker-compose is first-class** and matches our deployment target:
  `gradle composeUp` starts **Postgres, Keycloak, Server (Data Services),
  Frontend**. Default ports: Frontend `:8081`, Server `:8082`, Postgres `:8083`,
  Keycloak `:8089`. Toolchain: JDK 21, Gradle 8.5–8.x, Node 22, Docker Compose
  ≥ 2.20 (`docs/a12/project_template/project-template-documentation.md`). **[HIGH]**
### Decided — wiki12 build & deployment (see ADR-0005)

We **start from the Project Template but deviate**:
- **Own client.** Drop the template's `client/`; build our own A12-Widgets React
  app from scratch (per the Widgets Quick Start).
- **No Gradle — at all.** Replace the template's gradle build layer. Each
  component owns its build script under its `src/`, invoked from its Dockerfile
  during **`docker compose build`**. Consequences to resolve (below).
- **Orchestrated by `just` + docker-compose.** `just dev` (start stack with file
  watching), `just dev-stop`, `just dev-clean` (clean images); more later.
- **No Kubernetes / no Helm** (the A12 Helm "Stack" is Enterprise anyway).

Two gradle dependencies the template relies on that our build scripts must
replace (flagged, not yet resolved):
1. **Java Data Service build.** The template builds the Spring Boot server with
   gradle. "No gradle" ⇒ build it another way — **Maven** is the natural fit (A12
   ships Maven-coordinate artifacts/BOMs, e.g. `com.mgmtp.a12.dataservices:*`), run
   from the server's build script in its Dockerfile. **[decision: confirm Maven]**
2. **Kernel codegen (`validation.js` / typed accessors).** Generated from models;
   the template uses the `prepare-models` gradle plugin, but the generator also
   ships as a **CLI** (`kernel-md-typed-accessor-gen`, `*-CLI` classifier —
   `docs/a12/kernel/kernel-documentation-dev.md`). So a build script can invoke the
   kernel **CLI jar** (needs a JVM, not gradle). **[confirm a validation-code CLI exists too]**

- **Licensing:** dual — **Community (free, no-auth artifacts)** vs Enterprise
  (credential-gated). The base template + Data Services + Keycloak are
  **Community**; the Helm "A12 Stack" and Notification Center are Enterprise (not
  needed for our compose wiki) (`docs/a12/overall/access_artifacts.md`;
  `docs/a12/build_and_deployment/a12-stack.md`). **[HIGH]**
- **PostgreSQL is supported and is the prod target.** External-Postgres config via
  Spring profile `dataservices-external_postgres`: `spring.datasources.dataservices.url`
  (`jdbc:postgresql://…`), `.username/.password`, `org.postgresql.Driver`, HikariCP;
  schema auto-provisioned via **Liquibase** on startup
  (`docs/a12/data_services/dataservices-documentation-src.md § "External Postgres Database"/"Database Migration"`). **[HIGH]**

### Open issue — registry/credentials & "pure docker pull" path
- The exact npm/Gradle/Docker **registry URLs + auth** for `@com.mgmtp.a12.*` are
  **not in the public docs**; they come via the Project Template's config / mgm
  onboarding. Our email is `@mgm-tp.net` (mgm-internal) → likely the **internal
  mgm Artifactory**, not `artifacts.geta12.com`. **Confirm before scaffolding.** **[risk]**
- There is **no documented "just `docker pull` a prebuilt Data Service image"**
  path for Community use — the image is produced by `gradle buildImages` from the
  template (needs the JDK/Node/Gradle toolchain). This affects how "single
  `docker compose up`" (proposal goal) is achieved: we likely build images once,
  then `compose up`. **[risk to surface]**

---

## 7. The in-repo A12 reference (deliverable)

- **`docs/a12/`** — full geta12.com 2025.06/ext5 mirror: **104 doc pages** across
  29 categories, browsable via `docs/a12/index.md`. Tool: `src/scrape_geta12/`
  (re-runnable: static Asciidoctor HTML behind the SPA, fetched with curl).
- **`docs/a12/widgets/`** — A12 Widgets Showcase mirror: **65 component pages**
  (incl. Rich Text Editor + sub-pages, and the Quick Start guide). Tool:
  `src/scrape_showcase/` (SPA captured via browser, converted to Markdown).
- **Known gap:** `widgets/data-display/charts` (nested chart group) not pinned
  down; charts unused by wiki12. `deprecated-charts` overview is mirrored.

---

## 8. Markdown reference operations (wiki12 capability)

Operations over markdown body fields, as a **shared TS library** (e.g.
`src/md-refs/`) reused **server + client + CLI** — same pattern as `dm-to-fm`,
built on **Remark/mdast** (the Milkdown ecosystem, so parsing is consistent and
rewrites round-trip markdown losslessly):

- `getReferences(md) → Reference[]` — extract links, images, and wiki-internal
  content refs.
- `rewriteRefs(md, oldRef, newRef) → md` — rewrite matching refs.
- extensible (more ops later).

Two architectural hooks:
- **`rewriteRefs` completes slug-rename (ADR-0001).** Instead of only "old slug
  404s", a rename can **rewrite inbound links** (oldSlug → newSlug) to keep them
  valid. Revisits the "aliases deferred" stance — do we rewrite, 404, or both?
- **`getReferences` ⇒ a derived `references` field** (third twin of `Slug` /
  `searchText`): the before-write listener stores extracted refs (indexed), giving
  **backlinks** and answering "which docs reference slug X?" — the query the
  rename cascade needs to find bodies to rewrite.

**OPEN — gates the content-ref part:** define the **wiki-internal link syntax**
(`[label](page:albert_einstein)` slug-as-URL vs `[[page:albert_einstein]]`
wiki-style vs technical ID). Standard markdown links/images work regardless, but
content-ref extraction + rename-rewrite need this decided. **[decision]**

---

## 9. Open questions / risks log (for the review gate)

1. **Slug uniqueness race-safety** — approach decided (§1a): before-write listener
   + **transaction-scoped advisory lock** (generic, no schema change), DB unique
   index as optional fallback. **One unknown to verify:** can custom code inject a
   raw `JdbcTemplate`/`DataSource` to run the advisory lock? ([MED] inference;
   forum t/1214 covers only the DB-constraint route.) Confirm before Step 2.
2. **Unified cross-content search** — DECIDED (§3): batched fan-out (one
   `QUERY` per model in a single JSON-RPC request) + client-side merge; no shared
   supertype. Not a gate.
3. **Programmatic model authoring** — can we hand-author/generate Document/Form
   Model JSON outside the SME GUI? No documented schema/CLI validator found. **[gate]**
4. **Default form model** — no A12 generator (§2); DECIDED: server-side Node
   component generates the default FM on doc-model create/change (§4). DM→FM
   generator built (`src/dm-to-fm/`).
5. **Migration approach** — DECIDED (§4): TS migration runner in the server-side
   Node component (not the CLI; not Java `@MigrationStep`). Scripts stored as
   **`Migration` content-items (TS source)**; the service transpiles (TS→JS) +
   sandbox-runs per doc; gate at upload. ADR-0003 to be rewritten accordingly.
6. **Registry/credentials** — internal mgm Artifactory vs geta12.com; confirm
   access for `@com.mgmtp.a12.*` and Data Service artifacts. **[blocker before Step 1]**
7. **Build/deploy shape** — DECIDED (**ADR-0005**): start from Project Template
   but **no Gradle**; own client; per-component build scripts invoked by
   Dockerfiles via `docker compose build`; `just` (dev/dev-stop/dev-clean) over
   docker-compose; no k8s/Helm. **Open:** confirm Maven for the Java server build
   + a validation-code CLI (no-gradle codegen).
8. **Rich text vs markdown** — DECIDED (§5): editor = **Milkdown** (markdown-native,
   ProseMirror/Remark), store plain markdown in the String body field; wrap as a
   custom form-engine widget. Not the A12 Lexical RTE. Caveat: contenteditable
   focus/scroll (`data-role="text-output"`).
9. **Markdown reference ops + wiki-internal link syntax** (§8) — shared TS lib
   (`getReferences`/`rewriteRefs`); need to **define the wiki-internal link
   syntax** and the **slug-rename policy** (rewrite inbound links vs 404 vs both).
   A derived `references` field (twin of `searchText`) would index backlinks. **[decision]**

### Suggested artifact updates if findings are accepted
- **ADR-0005 (new):** build & deployment structure — Project Template minus
  Gradle; own client; per-component build scripts via `docker compose build`;
  `just` over docker-compose; no k8s/Helm. **(written)**
- **ADR-0002:** record the gate resolved → **GO** (Data Service–hosted logic).
- **ADR-0003:** migration runner moves **CLI → server-side Node component**;
  scripts move **filesystem → server-side storage** (migrations-as-content-items),
  sandbox-executed; resolve the storage/injection open question (§4).
- **domain.md / proposal.md:** soften "server-generated default form model" → it's
  generated by **our** server-side Node component on model lifecycle (not A12);
  clarify markdown body = plain markdown in a String field, edited with **Milkdown**
  (custom form widget), rendered with `react-markdown`.
- **architecture.md:** adopt Project Template as the scaffold; record JSON-RPC
  `/api/v2/rpc` + `simple_search`; unified search = batched fan-out + client-side
  merge (no shared supertype); slug = annotation-driven listener
  (field-level `wiki12.keyField`) + advisory lock; **add the server-side Node component**
  (form-gen + migration runner, model-lifecycle-triggered) alongside the Java
  Data Service (per-document logic); models runtime-deployable via app/CLI;
  build/deploy per **ADR-0005** (no Gradle, own client, `just` + docker-compose).
