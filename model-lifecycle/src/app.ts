// HTTP routing for the model-lifecycle service, built on Node's built-in http.
//
// Routes (served at root; the web client reaches them via an nginx `/lifecycle`
// prefix that is stripped, the CLI calls them directly):
//   GET  /health                -> { status, version }
//   GET  /form-model/:type       -> stored/generated form model
//   PUT  /form-model/:type       -> store an explicit form model
//   GET  /migrations             -> list Migration items
//   GET  /migrations/:id         -> one Migration
//   PUT  /migrations/:id         -> update a Migration's TS `script`
//   POST /models                 -> deploy a data model (upload GATE)
//   POST /migrate                -> run a stored migration (dry-run aware)
//
// The handler is dependency-injected (registry, dataService) so tests drive it
// without a network or a real Data Service.

import type { IncomingMessage, ServerResponse } from "node:http";
import { generateDefaultFormModel } from "./formgen.ts";
import { GateError, Registry } from "./registry.ts";
import { runMigration } from "./migrate/runner.ts";
import type { DataService } from "./dataservice.ts";
import type {
  DeployRequest,
  FormModel,
  Migration,
  MigrateRequest,
} from "./types.ts";

export interface AppDeps {
  registry: Registry;
  dataService: DataService;
  version: string;
}

type Handler = (req: IncomingMessage, res: ServerResponse) => Promise<void> | void;

function send(res: ServerResponse, status: number, body: unknown): void {
  const json = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json" });
  res.end(json);
}

async function readJson<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {} as T;
  return JSON.parse(raw) as T;
}

/** Build the request handler. Returns a function usable with http.createServer. */
export function createApp(deps: AppDeps): Handler {
  const { registry, dataService, version } = deps;

  return async function handle(req, res) {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      const path = url.pathname.replace(/\/+$/, "") || "/";
      const method = req.method ?? "GET";
      const seg = path.split("/").filter(Boolean); // e.g. ["form-model","Person"]

      // GET /health
      if (method === "GET" && path === "/health") {
        return send(res, 200, { status: "ok", version });
      }

      // /form-model/:type
      if (seg[0] === "form-model" && seg.length === 2) {
        const type = decodeURIComponent(seg[1]);
        if (method === "GET") {
          const fm = registry.formModel(type);
          if (!fm) return send(res, 404, { error: `no form model for type ${type}` });
          return send(res, 200, fm);
        }
        if (method === "PUT") {
          const fm = await readJson<FormModel>(req);
          if (!registry.getModel(type)) {
            return send(res, 404, { error: `no deployed model for type ${type}; deploy it first` });
          }
          registry.setFormModel(type, fm);
          return send(res, 200, fm);
        }
      }

      // /migrations and /migrations/:id
      if (seg[0] === "migrations") {
        if (seg.length === 1 && method === "GET") {
          return send(res, 200, registry.listMigrations());
        }
        if (seg.length === 2) {
          const id = decodeURIComponent(seg[1]);
          if (method === "GET") {
            const m = registry.getMigration(id);
            if (!m) return send(res, 404, { error: `no migration ${id}` });
            return send(res, 200, m);
          }
          if (method === "PUT") {
            const existing = registry.getMigration(id);
            if (!existing) return send(res, 404, { error: `no migration ${id}` });
            const body = await readJson<{ script: string }>(req);
            if (typeof body.script !== "string") {
              return send(res, 400, { error: "body must include a string `script`" });
            }
            const updated = registry.putMigration({ ...existing, script: body.script });
            return send(res, 200, updated);
          }
        }
      }

      // POST /models  (the upload GATE)
      if (method === "POST" && path === "/models") {
        const body = await readJson<DeployRequest>(req);
        if (!body.documentModel?.header?.id) {
          return send(res, 400, { error: "body.documentModel is required" });
        }
        try {
          const result = registry.deploy(
            body.documentModel,
            body.migration,
            generateDefaultFormModel,
          );
          return send(res, 200, result);
        } catch (e) {
          if (e instanceof GateError) return send(res, 409, { error: e.message });
          throw e;
        }
      }

      // POST /migrate
      if (method === "POST" && path === "/migrate") {
        const body = await readJson<MigrateRequest>(req);
        const { type, from, to } = body;
        const dryRun = body.dryRun === true;
        if (!type || !Number.isInteger(from) || !Number.isInteger(to)) {
          return send(res, 400, { error: "body requires {type, from:int, to:int, dryRun?}" });
        }
        const migration: Migration | undefined = registry.findMigration(type, from, to);
        if (!migration) {
          return send(res, 404, { error: `no migration for ${type} ${from}->${to}` });
        }
        const deployed = registry.getModel(type);
        if (!deployed) {
          return send(res, 404, { error: `no deployed model for type ${type}` });
        }
        const { report } = await runMigration({
          migration,
          documentModel: deployed.documentModel,
          dataService,
          dryRun,
        });
        return send(res, 200, report);
      }

      return send(res, 404, { error: `no route for ${method} ${path}` });
    } catch (e) {
      return send(res, 500, { error: e instanceof Error ? e.message : String(e) });
    }
  };
}
