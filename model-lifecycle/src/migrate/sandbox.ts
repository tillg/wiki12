// Sandboxed execution of an operator-supplied per-document transform.
//
// The migration script is untrusted code (operators upload TS source; in the
// unauthenticated baseline anyone reaching the service can drive it — ADR-0003
// "Accepted risk"). It MUST run with no fs/net access.
//
// Sandbox choice (documented in README): prefer `isolated-vm` (a true V8 isolate
// with no ambient Node globals). If `isolated-vm` is not installed in this
// environment (native build failure), fall back to Node's built-in `node:vm`
// with a frozen, fs/net-free context.
//
// VERIFY: harden sandbox (isolated-vm) before running untrusted operator scripts.
// The node:vm fallback is NOT a security boundary against a determined attacker
// (vm escapes are possible); it only removes ambient globals. Ensure isolated-vm
// is the path in any environment that executes untrusted scripts.

const DEFAULT_TIMEOUT_MS = 1000;

export interface SandboxResult {
  ok: boolean;
  value?: unknown;
  error?: string;
}

export interface Sandbox {
  /** Which backend is active: "isolated-vm" or "node:vm". */
  readonly backend: string;
  /**
   * Run compiled JS that defines a transform and apply it to `doc`. `code` is
   * the already-transpiled JS module body; it must assign the transform fn to
   * a global `__migrate` (the runner arranges this). Returns the transformed
   * document (structured-clone-safe JSON) or an error.
   */
  run(code: string, doc: unknown, timeoutMs?: number): Promise<SandboxResult>;
}

// ---- isolated-vm backend (preferred) -------------------------------------
async function tryIsolatedVm(): Promise<Sandbox | undefined> {
  let ivm: typeof import("isolated-vm");
  try {
    ivm = (await import("isolated-vm")).default ?? (await import("isolated-vm"));
  } catch {
    return undefined; // not installed / native build failed
  }
  return {
    backend: "isolated-vm",
    async run(code, doc, timeoutMs = DEFAULT_TIMEOUT_MS) {
      const isolate = new ivm.Isolate({ memoryLimit: 64 });
      try {
        const context = await isolate.createContext();
        const jail = context.global;
        await jail.set("global", jail.derefInto());
        // The transform runs against a JSON string we hand in and read back —
        // no live references cross the boundary.
        const input = JSON.stringify(doc);
        const wrapped = `
          (function(){
            const __input = ${JSON.stringify(input)};
            ${code}
            const __doc = JSON.parse(__input);
            const __out = __migrate(__doc);
            return JSON.stringify(__out === undefined ? __doc : __out);
          })()
        `;
        const out = await context.eval(wrapped, { timeout: timeoutMs });
        return { ok: true, value: JSON.parse(out as string) };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      } finally {
        isolate.dispose();
      }
    },
  };
}

// ---- node:vm fallback ----------------------------------------------------
async function nodeVmSandbox(): Promise<Sandbox> {
  const vm = await import("node:vm");
  return {
    backend: "node:vm",
    async run(code, doc, timeoutMs = DEFAULT_TIMEOUT_MS) {
      // A frozen, empty context: no `require`, `process`, `fetch`, `globalThis`
      // Node builtins — only what we explicitly place here.
      const sandbox: Record<string, unknown> = Object.create(null);
      sandbox.__input = JSON.stringify(doc);
      const context = vm.createContext(sandbox, {
        codeGeneration: { strings: false, wasm: false },
      });
      const wrapped = `
        (function(){
          "use strict";
          ${code}
          var __doc = JSON.parse(__input);
          var __out = __migrate(__doc);
          return JSON.stringify(__out === undefined ? __doc : __out);
        })()
      `;
      try {
        const script = new vm.Script(wrapped);
        const out = script.runInContext(context, { timeout: timeoutMs });
        return { ok: true, value: JSON.parse(out as string) };
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : String(e) };
      }
    },
  };
}

let cached: Promise<Sandbox> | undefined;

/** Get the process-wide sandbox, preferring isolated-vm. */
export function getSandbox(): Promise<Sandbox> {
  if (!cached) {
    cached = (async () => (await tryIsolatedVm()) ?? (await nodeVmSandbox()))();
  }
  return cached;
}
