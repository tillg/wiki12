# Plan — System area redesign

Ordered, checkbox steps. Read [`proposal.md`](proposal.md) and
[`architecture.md`](architecture.md) first. Each step is test-first where a test
harness exists (CLI: `node --test`; client: Vitest). Web changes finish with a
browser verification (screenshots to `tmp/`).

> **Coordination gate:** the in-flight `slug-based-urls` change is editing
> `client/src/App.tsx` and `client/src/pages/BrowsePage.tsx`. **Land or rebase
> onto that merge before steps 4, 8, 9** (nav + **New ▾**) to avoid clobbering its
> routing and `lib/refUrl.ts` helpers. The **auth phase (1–3)** touches
> `server/`, `docker/`, `cli/`, and `client/src/lib/auth.ts` — independent of the
> slug work, so it can start now.

## 0. Branch & baseline

- [ ] Create branch `feat/system-area-redesign` off the merged `slug-based-urls`
      tip (or current `main` if that work has merged).
- [ ] Confirm `cd client && npm run test`, `cd cli && npm test`, and `just test`
      are green before any edits (baseline).

---

## Phase A — Auth → Keycloak/OIDC (foundational; land first, own commit + ADR)

> Highest-risk, shared-contract change. Get the stack authenticating end-to-end
> on Keycloak before any System-area UI work.

### 1. ADR + Data Service as OAuth2 resource server

- [ ] Write **`docs/adr/0006-keycloak-oidc-auth.md`**: decision to move from UAA
      LOCAL (super-user-grants-all) to OAuth2/OIDC with Keycloak; scheme change
      `UAABearer` → `Bearer`; **web logs in on Keycloak (Auth-Code + PKCE
      redirect)**, **CLI uses direct-access-grant + offline token**; roles mapped,
      op-gating deferred. (CLAUDE.md: read/author ADRs for auth/extensibility.)
- [ ] Switch `server/config/application-wiki12.properties` to
      `authentication.types=OAUTH2` with the `resourceserver.tenants[0].jwt.*`
      issuer/JWKS/audience config and `role-mapping-from-token.field-name`; remove
      the LOCAL/super-user/HS256 lines. Adjust `SPRING_PROFILES_ACTIVE` if needed.
- [ ] Verify (running stack): an RPC with **no** token now 401s; an RPC with a
      Keycloak access token (grab one via `curl` ROPC against the realm) succeeds.
      Resolve any issuer-URI mismatch (VERIFY-5).

### 2. Realm config

- [ ] Confirm/extend `docker/keycloak/wiki12-realm.json`: `wiki12-web` has the
      flows we need, `webOrigins`/`redirectUris` cover dev hosts, and
      `offline_access` scope is assignable. Decide CLI client (reuse `wiki12-web`
      vs dedicated) — VERIFY-1.
- [ ] Verify: `just dev` imports the realm; the token endpoint issues an access
      token (and an offline token when `scope=offline_access`).

### 3. Web client logs in on Keycloak (redirect / Auth-Code + PKCE)

- [ ] Replace the in-app credential form: `LoginPage.tsx` becomes a "Log in with
      Keycloak" kickoff that redirects to Keycloak's `/authorize` (code flow +
      PKCE, `client_id=wiki12-web`); add a `/callback` route that completes the
      code-for-token exchange. Drive it with the A12 UAA frontend lib or
      `oidc-client-ts` (VERIFY-1). Add the `/callback` route to `App.tsx` and
      ensure nginx serves it.
- [ ] Update `client/src/lib/auth.ts` + API header attach: hold tokens in memory
      with refresh-token silent renew, switch to `Authorization: Bearer`, logout
      hits Keycloak's end-session endpoint; keep 401-auto-logout.
- [ ] Verify in browser: clicking "Log in with Keycloak" lands on Keycloak's
      hosted page; after `admin`/`admin`, redirect back, Browse loads via
      authenticated RPCs, logout works. Screenshot → `tmp/`.

### Seed/tests fallout

- [ ] Give `seed/` and any Data-Service-hitting test a token path (service-account
      client or a seeded login); update `just seed`. Re-green `just test`.

---

## Phase B — System area UI

### 4. System sub-routes scaffold (web)

- [ ] Add nested routes in `App.tsx`: `/system` → redirect `/system/dashboard`;
      `/system/{dashboard,cli,models,users}`.
- [ ] Split `SystemPage.tsx` into a thin outlet + `pages/system/` section
      components; move the existing **Users** (Keycloak link) and **Migrations**
      UI verbatim into `UsersSection` and `ModelsAndMigrationsSection`.
- [ ] Verify: each `/system/*` route renders; Migrations editor still works.

### 5. Two-level menu + collapse (web) — *after coordination gate*

- [ ] Replace the flat `Sidebar` `FlyoutMenu` with a two-level structure (Browse
      top-level; System expands to its four sub-sections); highlight active route.
- [ ] Lift `subExpanded` into `Shell` state; add a `<` icon `Button` toggling it
      (+ re-expand). Wire `onExpansionChange`. Remove top-level **New page**.
- [ ] Verify in browser: menu nests, `<` collapses/expands, active highlights, no
      New page. Screenshot → `tmp/`.

### 6. Dashboard data helper (web) — test-first

- [ ] Vitest for a pure `dashboardMetrics(cards, now)` helper → `{ total, byType:
      [{name,value}], changedLast7d }`. Cover empty, mixed types, 6-days-ago
      (counts) vs 8-days-ago (doesn't).
- [ ] Implement (in `api/search.ts` or new `api/dashboard.ts`) until green.

### 7. Dashboard view (web)

- [ ] `DashboardSection.tsx`: counters (A12 `counter`/`status`/`card`) for total
      cards, Pages, changed-last-7d; `PieChart` for entities-by-type. No hand-set
      semantic colors (CLAUDE.md).
- [ ] Verify with seeded content: counts plausible, pie renders a slice per entity
      type. Screenshot → `tmp/`. (Fall back to `recharts` if needed — VERIFY-3.)

### 8. "New ▾" on Browse (web) — *after coordination gate*

- [ ] Add a `PopUpMenu`/`dropdown` **New ▾** by the Browse heading; items from
      `CONTENT_MODELS`, each → `/create?type=<Model>`.
- [ ] Verify: dropdown lists Page + each entity type; selecting routes to the
      correct create form. Screenshot → `tmp/`.

### 9. Models & migrations — model list (web)

- [ ] In `ModelsAndMigrationsSection`, add a read-only Data Model list (names +
      `wiki12.version`) via the same contract as `wiki12 model list`.
- [ ] Verify: models listed alongside the migrations editor; section renamed in
      nav + heading to **Models & migrations**.

---

## Phase C — CLI auth (Keycloak offline tokens + login sets)

### 10. CLI config / login sets — test-first

- [ ] `node --test` for pure `config.ts`: read/write
      `~/.config/wiki12/config.json` (override via `$WIKI12_CONFIG`),
      `{active, sets}` with `{dataServiceUrl, issuerUrl, clientId, offlineToken}`;
      add/remove/use; round-trip. File chmod 600.
- [ ] Implement until green.

### 11. CLI token exchange + resolution — test-first

- [ ] `node --test` for: building the Keycloak token-endpoint URL from a set;
      exchanging an offline token for an access token (`grant_type=refresh_token`,
      mocked transport); resolution order `--context` → `WIKI12_TOKEN` env →
      active set → none. Env stays highest-priority override.
- [ ] Implement `cli/src/auth.ts` + extend `rpc.ts` (attach `Bearer`) until green.

### 12. `wiki12 login` — test-first

- [ ] `node --test`: with a mocked transport, `login` does a direct access grant
      (`grant_type=password`, `scope=openid offline_access`, `Accept-Language`
      set) and writes the **offline token** into the named/active set.
- [ ] Implement `commands/login.ts` (`--name`, `--url`, `--issuer`; prompt or flags
      for user/pw); wire into `index.ts`.

### 13. `wiki12 context` — test-first

- [ ] `node --test` for `context list|use|remove`.
- [ ] Implement `commands/context.ts`; wire into `index.ts` + `help.ts`.

### 14. CLI access section (web)

- [ ] `CliAccessSection.tsx`: documentation-only — show `wiki12 login`, the
      issuer/realm/client values, and an offline-token/revocation note (link to
      Keycloak console). No browser-side token minting.
- [ ] Verify in browser: guidance renders/correct. Screenshot → `tmp/`.

---

## Phase D — Docs & full verification

### 15. Docs & specs sync

- [ ] `cli/README.md` (Keycloak `login`/`context`, offline tokens, resolution
      order), `client/README.md` (Keycloak login + System sub-area + Dashboard).
- [ ] `specs/system/functional.md`: Keycloak/OIDC auth (replacing LOCAL),
      System sub-sections, Dashboard, CLI offline-token/login sets, **New ▾** on
      Browse, removed menu **New page**. Update the *Permissions & visibility*
      section (auth now real; op-gating still deferred).
- [ ] Strike confirmed VERIFY items.

### 16. Full verification

- [ ] `just test` (all offline suites) green; `cd client && npm run build` green.
- [ ] `just dev`; walk end-to-end: Keycloak login → collapse menu → Dashboard →
      New ▾ create → Models & migrations → `wiki12 login` (offline token) →
      `wiki12 context use` → a CLI read → revoke the offline token in Keycloak →
      confirm CLI access dies. Screenshots → `tmp/`.

## VERIFY checklist (from architecture.md)

- [ ] VERIFY-1 web ROPC flow works / CLI client choice (`wiki12-web` vs dedicated).
- [ ] VERIFY-5 issuer-URI match across hosts + `Bearer` scheme on the resource server.
- [ ] VERIFY-6 realm-role → A12 principal mapping (`realm_access.roles`).
- [ ] VERIFY-2 Data Service QUERY total-count support.
- [ ] VERIFY-3 `PieChart` renders in our `widgets-core` version.
