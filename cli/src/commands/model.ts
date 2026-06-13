// `wiki12 model list|create|read|update <type>` — data-model management via
// the model-lifecycle service.
//
// Routes (integration contract):
//   GET  /models            list
//   POST /models            upload data model (+ Migration on a version bump)
//   GET  /models/:type      read         VERIFY: read route shape
//   PUT  /models/:type      update       (gated: a version bump requires its Migration)
//
// VERIFY: the exact /models payload (model JSON envelope + migration field) and
// whether read/update are /models/:type or query params — assumed below.

import { readFileSync } from "node:fs";
import { parseArgs } from "../args.ts";
import { HELP } from "../help.ts";
import { LifecycleClient } from "../lifecycle.ts";

export interface LifecycleContext {
  lifecycle: LifecycleClient;
  out: (msg: string) => void;
  err: (msg: string) => void;
}

export async function runModel(
  ctx: LifecycleContext,
  sub: string,
  rest: string[],
): Promise<number> {
  const { lifecycle, out, err } = ctx;
  const parsed = parseArgs(rest);
  const type = parsed.positionals[0];

  switch (sub) {
    case "list": {
      const models = await lifecycle.send<unknown[]>("GET", "/models");
      out(JSON.stringify(models, null, 2));
      return 0;
    }

    case "read": {
      if (!type) return needType(err);
      const model = await lifecycle.send("GET", `/models/${type}`);
      out(JSON.stringify(model, null, 2));
      return 0;
    }

    case "create": {
      if (!type) return needType(err);
      const model = parsed.flags.file
        ? JSON.parse(readFileSync(parsed.flags.file, "utf8"))
        : undefined;
      await lifecycle.send("POST", "/models", { type, model });
      out(`Uploaded data model "${type}"`);
      return 0;
    }

    case "update": {
      if (!type) return needType(err);
      const model = parsed.flags.file
        ? JSON.parse(readFileSync(parsed.flags.file, "utf8"))
        : undefined;
      // A version bump must carry its Migration (gated at upload).
      const migration = parsed.flags.migration
        ? readFileSync(parsed.flags.migration, "utf8")
        : undefined;
      const toVersion = parsed.flags["to-version"];
      const body: Record<string, unknown> = { type, model };
      if (migration !== undefined) body.migration = migration;
      if (toVersion !== undefined) body.toVersion = toVersion;
      await lifecycle.send("POST", "/models", body);
      out(
        migration
          ? `Uploaded data model "${type}" v${toVersion ?? "?"} with its migration`
          : `Uploaded data model "${type}"`,
      );
      return 0;
    }

    default:
      err(`unknown subcommand "${sub}"`);
      err(HELP.model);
      return 2;
  }
}

function needType(err: (m: string) => void): number {
  err("a <type> is required");
  return 2;
}
