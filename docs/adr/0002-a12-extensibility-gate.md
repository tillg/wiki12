# A12 server-side extensibility is one gate, with a façade fallback

Several baseline behaviors must run at the server boundary so the web client and
the `wiki12` CLI cannot diverge: **slug derivation** (key fields → slug, sticky
suffix, old→new diff — see ADR-0001), **slug resolution** (try-ID-then-slug),
and **substring search** over title/slug/body. All three are the same bet —
that the stock A12 Data Service can run custom server-side logic and queries.

## Decision

We treat that bet as a **single go/no-go** at the Step 0 research review gate,
rather than as independent per-feature research:

- **A12 is server-side extensible** (computed fields / write hooks / custom
  queries) → the behaviors live in the Data Service, as the architecture
  specifies.
- **A12 is a closed black box** → we introduce a thin **façade service** in
  front of it *up front*, and that façade owns **all three** custom behaviors.
  A12 is then used purely as model-driven storage. Pushing the logic into the
  clients is rejected (direct API writes — seeds, migrations, future clients —
  would bypass it).

## Why

The three behaviors share one dependency, so deciding them together avoids
discovering the same limitation three times (or mid-implementation) and avoids a
piecemeal architecture where some logic sits in A12 and some in clients. One
decision, one pre-agreed fallback, evaluated once.

## Consequence

Step 0 must answer "Is the A12 Data Service extensible server-side?" before any
implementation begins; the answer selects the architecture. ADR-0001's slug
logic placement is a specific instance of this gate.
