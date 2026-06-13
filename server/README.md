# wiki12 — Java A12 Data Service

The server component of wiki12: a **Spring Boot A12 Data Service** that hosts the
platform's model-driven CRUD plus wiki12's per-document logic. Everything here runs
**inside the stock Data Service** — no façade (ADR-0002 = GO).

## What's here

```
server/
├── build.gradle                     # Gradle build (the ONE place wiki12 uses Gradle — ADR-0005)
├── settings.gradle                  # root project + A12 plugin repo
├── gradle.properties                # no-auth A12 repo, JDK 21, skip checkstyle, a12Version
├── Dockerfile                       # multi-stage: gradle(JDK21) -> JRE; arg WIKI12_VERSION; :8080
├── .dockerignore
├── src/main/resources/
│   └── application.yaml             # dataservices-external_postgres profile, allowedOperations, actuator health
├── src/main/java/net/mgmtp/wiki12/
│   ├── Wiki12DataServiceApplication.java   # Spring Boot entrypoint (component-scans wiki12 + A12)
│   ├── slug/
│   │   ├── Slugifier.java                   # PURE slug algorithm — no A12 deps (unit-tested)
│   │   ├── SlugAnnotations.java             # wiki12.keyField / wiki12.derived / wiki12.searchable constants
│   │   ├── WikiContentLifecycleListener.java# @CommonDataServicesEventListener: before-create/update wiring
│   │   └── SlugDerivationService.java       # advisory lock + key-field read + collision _N + searchText blob
│   └── operation/
│       ├── ResolveBySlugOperation.java      # @RemoteOperation "ResolveBySlug" (try-ID-then-slug)
│       └── UnifiedSearchOperation.java      # @RemoteOperation "UnifiedSearch" (batched simple_search fan-out)
└── test/
    └── SlugifierTest.java           # framework-free harness (javac + java), the one piece actually run
```

## Extension points used (all stock A12, findings §0)

- **Document lifecycle hooks** — `WikiContentLifecycleListener` is a `@Component` with
  `@CommonDataServicesEventListener` methods handling `DocumentBeforeCreateEvent` /
  `DocumentBeforeUpdateEvent`. It derives the read-only `slug` and the `searchText`
  blob inside the write transaction and mutates the document via `withBatchUpdates`.
- **Custom JSON-RPC operations** — `ResolveBySlugOperation` and
  `UnifiedSearchOperation` are `@RemoteOperation` beans with a public `rpc(...)`,
  whitelisted in `mgmtp.a12.dataservices.jsonRpc.allowedOperations`.
- **Injected platform services** — `QueryService`, `IDocumentRepository`,
  `IModelLoader<IDocumentModel>`, `DocumentModelServiceFactory`, plus a raw
  `JdbcTemplate` for the advisory lock.

### Slug / searchText derivation (ADR-0001, findings §1a/§3)

The listener reads field-level annotations off the Document Model:

- `wiki12.keyField="<order>"` — key fields, concatenated in order, slugified into the
  `<name>` part. Slug is `<type>:<name>`, `page` is the default namespace.
- `wiki12.derived="slug"` — the field the derived slug is written to.
- `wiki12.derived="searchText"` — the field the searchText blob is written to.
- `wiki12.searchable="true"` — fields concatenated into the searchText blob.

Collisions get a **sticky `_N` suffix** on the name part (`person:till_gartner_2`),
fixed at creation; on update the suffix is preserved when the name part is unchanged.
When an update changes the slug, the old→new diff is surfaced (currently logged — see
the rename-notification VERIFY).

The **slug pure-algorithm** lives in `Slugifier` (no A12 deps) so it is fully
unit-testable; `SlugDerivationService` owns the A12-bound parts (lock, model read,
collision query, document mutation).

## Environment it reads

| Env var | Meaning | Default |
|---|---|---|
| `SPRING_DATASOURCES_DATASERVICES_URL` | JDBC URL of the external Postgres | `jdbc:postgresql://postgres:5432/wiki12` |
| `SPRING_DATASOURCES_DATASERVICES_USERNAME` | DB user | `wiki12` |
| `SPRING_DATASOURCES_DATASERVICES_PASSWORD` | DB password | `wiki12` |
| `WIKI12_VERSION` (build arg) | single stack version, stamped into the image | `0.1.0` |

Active Spring profile: **`dataservices-external_postgres`**. Actuator health at
`/actuator/health`. Server port `8080`. Keycloak is referenced but auth is **not**
enforced in the baseline.

## How to build

This is built as a container image via docker-compose (ADR-0005 — build lives in the
component, driven by compose; there is no top-level Gradle):

```sh
docker compose build data-service
```

The Dockerfile's build stage runs the Gradle `bootJar` (resolving `com.mgmtp.a12.*`
from `https://artifacts.geta12.com`, no auth) and the runtime stage runs the jar on a
JRE. **Do not** expect a local `gradle build` to work without the A12 artifacts.

### Verifying the pure Slugifier (the one real test in this pass)

`Slugifier` has no A12 dependencies, so it compiles and tests with plain `javac`:

```sh
cd server
javac -d /tmp/wiki12-slugtest \
    src/main/java/net/mgmtp/wiki12/slug/Slugifier.java \
    test/SlugifierTest.java
java -cp /tmp/wiki12-slugtest SlugifierTest
# -> "SlugifierTest: 25 passed, 0 failed"
```

> Note: the baseline slug rule is `[a-z0-9_]` with **no transliteration** — non-ASCII
> letters are dropped, so `café` → `caf`, not `cafe`. If accent-folding is wanted later,
> NFD-normalize + strip combining marks before `slugify`.

## `// VERIFY` assumptions — must be checked against a live A12 server

Everything below is inferred from the docs mirror and the tutorials; the exact A12 API
shape was not confirmable offline. Grep the source for `VERIFY` to find each in context.

### Hard gate (blocks Step 2 slug work — findings §1a / ADR-0001)

1. **Raw `JdbcTemplate` injection bound to the A12 write transaction.**
   `SlugDerivationService` injects `JdbcTemplate` and runs
   `select pg_advisory_xact_lock(hashtext(?))`. This must (a) inject successfully
   against the `dataservices` DataSource (may need `@Qualifier`), and (b) run inside
   A12's write transaction so the lock auto-releases on commit/rollback. This is the
   **slug-concurrency spike dependency** — there is **no DB-unique-index backstop**, so
   if this fails the slug invariant has no fallback (see
   `specs/changes/basic_setup/spike-slug-concurrency.md`, Probe A).
   - Sub-item: `jdbcTemplate.queryForObject(..., Void.class)` call shape for a
     void-returning function may need adjusting (`execute` / wrap in `select 1 from (...)`).

### Lifecycle event API

2. Import packages for `CommonDataServicesEventListener`,
   `DocumentBeforeCreateEvent`, `DocumentBeforeUpdateEvent` (FQNs inferred).
3. Event accessors: `getCreatedDocument()/setCreatedDocument()`,
   `getUpdatedDocument()/getPersistedDocument()/setUpdatedDocument()`.
4. **Slug-rename notification channel** — how a before-update listener returns a
   non-document payload (old→new) to the client. Currently logged only; needs a real
   channel (event metadata / per-request notification collector / RPC response
   interceptor) to satisfy ADR-0001's "response carries old→new".
5. `DocumentV2.getDocumentModelId()` (used in the tutorial; assumed available).

### Document read / mutate API

6. `DocumentV2.withBatchUpdates(List<UpdateAction>)` and
   `UpdateAction.putFieldValue(path, value)` — from the document-manipulation tutorial
   (high confidence, but path-string overload of `putFieldValue` is assumed).
7. Reading a String field by absolute path from `DocumentV2`
   (`getStringValueByPath` is a placeholder name — the tutorial reads via
   `FieldInstanceV2.value()` or typed accessors).
8. Reading the docRef of a persisted `DocumentV2` (to exclude self on update).

### Model introspection (reading wiki12.* annotations)

9. Enumerating all fields of a Document Model (`allFields` is a placeholder), the
   absolute path of a field (`fieldPath`), and reading a named annotation value off a
   field (`annotationValue` — likely `IField.getAnnotations()` → name/value pairs).
   `SlugDerivationService.readConfig` is correct in shape but these three helpers are
   stubbed and must be wired to the real kernel model API.

### Query API

10. `QueryRoot.builder()` with `targetDocumentModel` / `projectionName("document")` /
    `fields(...)` / `constraint(...)` — modeled on the custom-endpoint tutorial.
11. `ExactMatchOperator.builder().field(...).value(...)` — from the tutorial (high
    confidence).
12. `SimpleSearchOperator.builder().fields(...).value(...)` — operator exists in the
    docs; the Java builder class name/shape is inferred from the ExactMatch pattern.
13. Reading projection-row results: extracting a docRef and a projected scalar field
    from `queryService.query(...).getContent()` rows. The tutorial casts to
    `DocumentTreeResult` and calls `getDocRef()`; reading a projected field value is
    not shown. The `extractDocRef` / `extractSlug` / `readField` / `readDocRef`
    helpers return `null` placeholders pending this.
14. Collision query efficiency: a prefix/`simple_search` operator would beat
    fetch-all-and-filter for the `_N` scan.

### Resolution / model conventions

15. Technical-ID grammar (uppercase ULID with prefix) for the try-ID-then-slug
    disjointness check (`looksLikeTechnicalId`).
16. `DocumentReference.of(id)` factory and whether an id needs a model prefix to form a
    docRef for `GET_DOCUMENT`.
17. Namespace ↔ model-id convention (`Person_DM` ↔ `person`, slug field at
    `/<Type>/Slug`). `UnifiedSearchOperation`'s content-model registry is **hardcoded**
    for `page/person/film/location` — should become dynamic once models are
    runtime-deployable (ADR-0003).

### Build / boot

18. A12 Maven coordinates and the `a12Version` line (`build.gradle` dependency names
    are best-guess; confirm via `mvn dependency:get` against artifacts.geta12.com).
19. Spring Boot plugin version and the `bootJar` task / jar output name in the
    Dockerfile.
20. Whether `@SpringBootApplication` auto-config is enough or the A12 platform requires
    an explicit `@Import` / base application class, and which `com.mgmtp.a12.*` base
    packages must be component-scanned.
21. `application.yaml`: the default `allowedOperations` group tokens, the exact
    external-Postgres key names, and the A12 UAA/Keycloak property keys (auth deferred).
