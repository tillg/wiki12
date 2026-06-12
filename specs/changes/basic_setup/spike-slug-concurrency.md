# Spike: slug concurrency primitives (gate before Step 2)

**Purpose.** Decide *how* wiki12 makes slugs race-safe-globally-unique, by
confirming which concurrency primitive the stock A12 Data Service actually gives
custom code. This is a **hard gate**: the review gate chose the advisory lock with
**no DB-index backstop**, so if the required primitive is absent the slug design
must change before any Step-2 slug code is written. See ADR-0001 and
`findings-a12.md §1a`.

**The two unknowns** (both [MED] inference, neither documented in the read set):

| Probe | Question | Pass → mechanism |
|---|---|---|
| **A** | Can a custom bean inject a raw `JdbcTemplate`/`DataSource` and run native SQL (incl. `pg_advisory_xact_lock`) **inside the request transaction**? | Advisory lock (recommended primary) |
| **B** | Does a document `update` **reject a stale/concurrent write** (optimistic locking) instead of last-write-wins? | Per-`(model,name)` counter, or retry-on-conflict — **no raw SQL** |

**Decision matrix:**

```
A pass            → advisory lock (simplest; ~2 lines in the before-write listener)
A fail, B pass    → per-(model,name) counter as PRIMARY generator, or retry-on-conflict
both fail         → reopen the rejected DB partial unique index (only remaining hard guarantee)
```

## Prerequisites

- A scaffolded A12 Data Service (Step 1) running against Postgres — so this spike
  runs **between Step 1 and Step 2**.
- A trivial throwaway document model registered, e.g. `SpikeCounter` with one
  integer field `counter` (any model with a writable int field works).
- Ability to add a custom `@RemoteOperation` to the server and register it in
  `mgmtp.a12.dataservices.jsonRpc.allowedOperations`
  (per `findings-a12.md §0`).

This is throwaway code — delete the operation + model once the matrix is decided.

---

## Probe A — raw DataSource injection + advisory lock

**Hypothesis:** A12 is a standard Spring Boot + JPA app, so a `@Component`/
`@RemoteOperation` can `@Autowired` a `JdbcTemplate` and run native SQL within the
A12-managed transaction.

```java
// Drop into the server's custom-operations package; register the operation name
// in mgmtp.a12.dataservices.jsonRpc.allowedOperations.
@RemoteOperation
public class SpikeAdvisoryLockOp {

    private final JdbcTemplate jdbc;            // <-- the whole question: does this wire up?

    public SpikeAdvisoryLockOp(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional
    public Map<String, Object> rpc(Map<String, Object> params) {
        String key = String.valueOf(params.getOrDefault("key", "spike"));

        // 1) Can we run ANY native SQL from custom code?
        Integer one = jdbc.queryForObject("select 1", Integer.class);

        // 2) Can we take a transaction-scoped advisory lock? (auto-released at commit)
        jdbc.queryForObject(
            "select pg_advisory_xact_lock(hashtext(?))",
            (rs, n) -> rs.getObject(1), key);

        // 3) Optional: prove the lock actually serializes same-key callers.
        //    With the lock held, sleep, then read+increment a row. Run two
        //    concurrent calls with the SAME key: a correct lock yields counter==2,
        //    a broken/absent lock yields counter==1 (lost update).
        Integer before = jdbc.queryForObject(
            "select counter from spike_lock_test where k = ?", Integer.class, key);
        if (before == null) {
            jdbc.update("insert into spike_lock_test(k, counter) values (?, 0)", key);
            before = 0;
        }
        Thread.sleep(300);                       // widen the race window
        jdbc.update("update spike_lock_test set counter = ? where k = ?", before + 1, key);

        Integer after = jdbc.queryForObject(
            "select counter from spike_lock_test where k = ?", Integer.class, key);
        return Map.of("selectOne", one, "counter", after);
    }
}
```

```sql
-- one-time setup for sub-test (3); drop after the spike
create table spike_lock_test (k text primary key, counter int not null);
```

**How to run:**

1. Single call — confirms injection + native SQL + lock acquisition work at all:
   ```bash
   curl -s localhost:8082/api/v2/rpc -H 'content-type: application/json' -d '{
     "jsonrpc":"2.0","id":1,"method":"SpikeAdvisoryLockOp","params":{"key":"k1"}}'
   ```
2. Concurrency sub-test — fire two calls with the **same** key at once:
   ```bash
   curl ... -d '{...,"params":{"key":"race"}}' &
   curl ... -d '{...,"params":{"key":"race"}}' &
   wait
   ```

**PASS A** if: the bean wires up (no `NoSuchBeanDefinitionException`), `select 1`
returns, the advisory-lock call returns without error, **and** the two-call race
ends with `counter == 2` (the lock prevented the lost update).
**FAIL A** if: `JdbcTemplate`/`DataSource` can't be injected, native SQL is blocked,
or the race ends with `counter == 1`.

> If `JdbcTemplate` doesn't inject, retry with `DataSource` or
> `EntityManager.createNativeQuery(...)` before declaring FAIL — any one of them
> giving native SQL inside the transaction is enough.

---

## Probe B — optimistic locking on document update

**Hypothesis:** A12 document updates carry a version/revision and reject a write
made against a stale version (rather than silently overwriting). If so, a counter
(or retry-on-conflict) is race-safe **without** native SQL.

This needs no custom Java — drive it over JSON-RPC against the throwaway
`SpikeCounter` model. (An in-server variant using `IDocumentRepository` works too;
the API path is simpler and tests the same property.)

```text
1. ADD_DOCUMENT SpikeCounter { counter: 0 }            → returns docRef + a version
2. GET_DOCUMENT <docRef>  (call it COPY-1)             → version V
3. GET_DOCUMENT <docRef>  (call it COPY-2)             → version V (same)
4. MODIFY COPY-1 → counter: 1, sent with version V     → expect SUCCESS (version → V+1)
5. MODIFY COPY-2 → counter: 1, sent with version V     → THE TEST:
      - rejected with a stale-version / optimistic-lock / conflict error  → PASS B
      - silently succeeds (last-write-wins, no error)                     → FAIL B
```

Before running, inspect a `GET_DOCUMENT` response for the version carrier — likely
in `__meta` (a revision/version field distinct from `modelVersion`). Send that
value back on `MODIFY` so step 5 references the **stale** version on purpose.

**PASS B** if: step 5 is rejected because the document changed underneath it.
**FAIL B** if: step 5 overwrites step 4 with no complaint (concurrent increments
would then collide → a counter is unsafe without native SQL).

---

## After the spike

Record the outcome in `findings-a12.md §1a` and resolve ADR-0001's decision matrix:

- **A pass** → implement the before-write listener + `pg_advisory_xact_lock` (done).
- **A fail, B pass** → implement the per-`(model,name)` counter as the *primary*
  number generator (one counter doc per name; render `1` as the bare slug), with
  retry-on-conflict. Update ADR-0001 to record the mechanism change.
- **both fail** → reopen the DB partial unique index (ADR-0001 last-resort) and
  accept the project-specific Liquibase DDL coupled to A12's `document` table.

Delete the spike operation, the `spike_lock_test` table, and the `SpikeCounter`
model once decided.
