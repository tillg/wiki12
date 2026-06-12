# Build & deployment structure

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

- **No Gradle — at all.** The template's build is gradle end-to-end (image build,
  model prep/codegen, placeholder replacement, `composeUp`). We remove the gradle
  layer entirely. Rationale: a single, transparent build path we own, expressed
  per-component, without a gradle toolchain to learn/maintain.

## Build lives in each component, driven by docker-compose

Each component (`server`, `client`, model tooling, …) owns its **build script
under its own `src/`**. The component's **Dockerfile** invokes that script during
`docker compose build`. There is no top-level build tool orchestrating the
components — the unit of build is the container image, and docker-compose builds
them.

Consequences we accept and must implement:

- **Java Data Service** is built with **Maven** (not gradle), run from the
  server's build script in its Dockerfile. A12 publishes Maven-coordinate
  artifacts/BOMs (e.g. `com.mgmtp.a12.dataservices:*`), so a Maven Spring Boot
  build is viable. (Maven is not gradle; it satisfies "no gradle".)
- **Kernel codegen** (`validation.js` / typed accessors, generated from document
  models) is run by invoking the **kernel codegen CLI jar**
  (`kernel-md-typed-accessor-gen`, `*-CLI` classifier) from a build script — a
  JVM step, not gradle. This replaces the template's `prepare-models` gradle plugin.
- **Our own TS tooling** (`src/dm-to-fm` form generator, `src/model_tools`
  validator, and the future migration runner) runs on Node — invoked from build
  scripts / the Node service, never gradle.

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

## No Kubernetes, no Helm

wiki12 targets **docker-compose only**. We do not use Kubernetes or Helm charts.
(A12's Helm "Stack" is an Enterprise component and out of scope regardless.)

## Status / open items

- Confirm **Maven** as the Java server build tool (vs. another non-gradle path).
- Confirm a **validation-code generator CLI** exists alongside the typed-accessor
  CLI (the codegen the form engine's `validation.js` needs).
- Registry/credentials for `@com.mgmtp.a12.*` + Data Service artifacts remain a
  prerequisite (tracked in findings-a12.md §6).
- **PATCH-bump cadence:** "every compile bumps PATCH" means a `just dev` build
  rewrites `VERSION` each run (and shows as a git change). Decide whether the
  dev-watch loop bumps on every rebuild or only explicit `just build`/release
  runs, to avoid noisy churn during development.
