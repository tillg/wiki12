// `wiki12 form list|create|read|update <type>` — form-model management via the
// model-lifecycle service.
//
// Routes (integration contract):
//   GET /form-model/:type   read
//   PUT /form-model/:type   create/update (replace)
//   GET /form-model         list           VERIFY: list route shape
//
// A type with no explicit form model gets a generated default (server-side).

import { readFileSync } from "node:fs";
import { parseArgs } from "../args.ts";
import { HELP } from "../help.ts";
import type { LifecycleContext } from "./model.ts";

export async function runForm(
  ctx: LifecycleContext,
  sub: string,
  rest: string[],
): Promise<number> {
  const { lifecycle, out, err } = ctx;
  const parsed = parseArgs(rest);
  const type = parsed.positionals[0];

  switch (sub) {
    case "list": {
      const forms = await lifecycle.send<unknown[]>("GET", "/form-model");
      out(JSON.stringify(forms, null, 2));
      return 0;
    }

    case "read": {
      if (!type) return needType(err);
      const form = await lifecycle.send("GET", `/form-model/${type}`);
      out(JSON.stringify(form, null, 2));
      return 0;
    }

    case "create":
    case "update": {
      if (!type) return needType(err);
      const form = parsed.flags.file
        ? JSON.parse(readFileSync(parsed.flags.file, "utf8"))
        : undefined;
      await lifecycle.send("PUT", `/form-model/${type}`, { type, form });
      out(`Saved form model for "${type}"`);
      return 0;
    }

    default:
      err(`unknown subcommand "${sub}"`);
      err(HELP.form);
      return 2;
  }
}

function needType(err: (m: string) => void): number {
  err("a <type> is required");
  return 2;
}
