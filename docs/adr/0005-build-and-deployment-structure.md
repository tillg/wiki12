# Build & deployment structure

> **Revised (2026-06-12): Gradle is allowed — but ONLY to build the Java Data
> Service.** The original "no Gradle at all" stance is narrowed: the template
> ships a proven Gradle build for the server, and reusing it (contained in the
> server's Dockerfile) beats re-deriving a Maven build for no real gain. Gradle
> is still banned everywhere else — client, Node services, CLI, and
> orchestration. See the "Gradle" section below.

wiki12 starts from the **A12 Full-Stack Project Template** (release 2025.06) but
replaces its build and orchestration layer. We keep what the template gives us
that is hard to reproduce — the working Data Services server app, model/auth
setup, Keycloak + Postgres wiring — and discard the parts that don't fit how we
want to build and run wiki12.

## We use the Project Template — with changes

The template is the canonical, maintained full-stack A12 scaffold; from-scratch
would mean re-deriving server bootstrapping, model loading, and auth wiring. So
we adopt it as the starting point and deviate deliberately:

- **Own client — not the template's.** We do **not** use the template's `client/`.
  The wiki12 web client is our own React app built from scratch on A12 Widgets
  (`@com.mgmtp.a12.widgets/*`, `@com.mgmtp.a12.formengine/*`) per the A12 Widgets
  Quick Start. Rationale: we want full control of the UI (search, markdown editing
  with Milkdown, read views) rather than adapting the template's stock client.

- **Gradle for the Java server only.** The template's build is gradle end-to-end
  (image build, model prep/codegen, placeholder replacement, `composeUp`). We keep
  gradle **only** to build the Java Data Service (reusing the template's working
  server build), and remove it from everything else — there is **no top-level
  gradle** orchestrating components, and `composeUp`/`buildImages` are replaced by
  `just` + docker-compose. Rationale: the server's gradle build is proven and
  hard to reproduce; re-deriving it in Maven is risk for no gain. The client, the
  Node model-lifecycle service, the `wiki12` CLI, and orchestration stay
  gradle-free.

## Build lives in each component, driven by docker-compose

Each component (`server`, `client`, model tooling, …) owns its **build script
under its own `src/`**. The component's **Dockerfile** invokes that script during
`docker compose build`. There is no top-level build tool orchestrating the
components — the unit of build is the container image, and docker-compose builds
them.

Consequences we accept and must implement:

- **Java Data Service** is built with **Gradle** (the template's server build),
  invoked by the server's **Dockerfile** during `docker compose build`. It resolves
  `com.mgmtp.a12.*` artifacts from `artifacts.geta12.com`. This is the **one**
  place gradle runs.
- **Kernel codegen** (`validation.js` / typed accessors, generated from document
  models) rides that gradle build at build time (the template's `prepare-models`
  plugin) for any models bundled into the image. **Runtime** codegen — when a
  model is deployed live — is done **in-process by the Data Service** (JVM kernel
  libraries), per ADR-0003 / findings §4. No separate codegen CLI is needed.
- **Client, CLI, and Node tooling are gradle-free.** The React client builds with
  its own npm/Vite toolchain; the `wiki12` CLI and the Node model-lifecycle
  service (`src/dm-to-fm`, `src/model_tools`, migration runner) run on Node —
  invoked from their own build scripts / Dockerfiles, never gradle.

## Orchestration: `just` + docker-compose

A `justfile` is the operator entrypoint over docker-compose. Initial commands:

| Command | Does |
|---|---|
| `just dev` | start the full stack with **file watching** (live reload) |
| `just dev-stop` | stop the stack |
| `just dev-clean` | remove the built images |

More `just` commands will be added (seed, migrate, generate-models, etc.). `just`
recipes wrap `docker compose` (and the per-component scripts); they replace the
template's gradle tasks (`composeUp`, `buildImages`, `replacePlaceholders`).

## Versioning

- **One version for the whole stack.** All components (server, client, Node
  service, tooling) share a **single** version number — there are no
  per-component versions. Each component image is tagged with it, so the running
  stack reports one coherent version.
- **Semantic versioning** (`MAJOR.MINOR.PATCH`).
- **Single source of truth: a `VERSION` file in the project root** (plain text;
  initialised at `0.1.0`). Build scripts read it and stamp every component (build
  arg / env) so client, server, and services all report the same version. Any
  per-component manifest version (e.g. an npm `package.json`) is **derived from**
  `VERSION`, not maintained independently.
- **Every compile run bumps PATCH.** The build (a `just` recipe / the per-component
  build path) increments the third segment in `VERSION` on each compile. **MAJOR**
  and **MINOR** are bumped manually (breaking / feature changes); only **PATCH** is
  automatic.

## Identity: Keycloak is the sole user store

We keep the template's **Keycloak** as the **only** place users exist — wiki12
holds no user table and builds no login/RBAC in the baseline (auth is out of
scope, see proposal). The build **ensures an `admin`/`admin` user exists** so the
stack is usable out of the box. The web client's **System area links out to the
Keycloak console** for user maintenance rather than reimplementing it. Consuming
Keycloak for actual route/role protection is deferred to the auth change.

## No Kubernetes, no Helm

wiki12 targets **docker-compose only**. We do not use Kubernetes or Helm charts.
(A12's Helm "Stack" is an Enterprise component and out of scope regardless.)

## Status / open items

- ~~Confirm Maven as the Java server build tool~~ — **moot:** the Java server
  uses the template's **Gradle** build (revised 2026-06-12).
- ~~Confirm a validation-code generator CLI~~ — **moot:** build-time codegen rides
  the gradle `prepare-models` plugin; runtime codegen is in-process in the Data
  Service (ADR-0003). No standalone CLI required.
- **Registry — RESOLVED:** consume from **<https://artifacts.geta12.com>** (public
  JFrog, no login) for `com.mgmtp.a12.*` Maven, `@com.mgmtp.a12.*` npm, and Docker
  images. Not internal Artifactory, not Maven Central. Build from GitHub source
  only as a fallback. License: dual **EUPL-1.2** / commercial. Red Hat catalog
  images are outdated — don't use them. (findings §6.)
- **PATCH-bump cadence:** "every compile bumps PATCH" means a `just dev` build
  rewrites `VERSION` each run (and shows as a git change). Decide whether the
  dev-watch loop bumps on every rebuild or only explicit `just build`/release
  runs, to avoid noisy churn during development.
