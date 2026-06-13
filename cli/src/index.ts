// wiki12 CLI entrypoint + dispatch.
//
//   node --experimental-strip-types src/index.ts <command> [subcommand] ...
//
// Wires the default transports (fetch) into the RPC and lifecycle clients,
// then dispatches to the per-command handlers. Handlers are transport-agnostic
// so tests inject a mock transport (see test/).

import process from "node:process";
import { parseArgs } from "./args.ts";
import { runEntity, type CmdContext } from "./commands/entity.ts";
import { runForm } from "./commands/form.ts";
import { runMigrate } from "./commands/migrate.ts";
import { runModel, type LifecycleContext } from "./commands/model.ts";
import { runPage } from "./commands/page.ts";
import { runSearch } from "./commands/search.ts";
import { HELP, TOP_LEVEL_HELP } from "./help.ts";
import {
  fetchHttpTransport,
  LifecycleClient,
  modelLifecycleUrl,
} from "./lifecycle.ts";
import { dataServiceUrl, fetchTransport, RpcClient } from "./rpc.ts";

export async function run(argv: string[]): Promise<number> {
  const [command, ...tail] = argv;

  // Top-level help / no command.
  if (!command || command === "-h" || command === "--help") {
    console.log(TOP_LEVEL_HELP);
    return command ? 0 : 2;
  }

  // Per-command help: "wiki12 <cmd> -h" with no subcommand, or "-h" anywhere.
  const wantsHelp = tail.includes("-h") || tail.includes("--help");

  const rpcCtx: CmdContext = {
    rpc: new RpcClient(fetchTransport(dataServiceUrl())),
    out: (m) => console.log(m),
    err: (m) => console.error(m),
  };
  const lifecycleCtx: LifecycleContext = {
    lifecycle: new LifecycleClient(fetchHttpTransport(modelLifecycleUrl())),
    out: (m) => console.log(m),
    err: (m) => console.error(m),
  };

  switch (command) {
    case "search": {
      if (wantsHelp) {
        console.log(HELP.search);
        return 0;
      }
      return runSearch(rpcCtx, tail);
    }

    case "page": {
      const { positionals } = parseArgs(tail);
      const sub = positionals[0];
      if (wantsHelp && !sub) {
        console.log(HELP.page);
        return 0;
      }
      return runPage(rpcCtx, sub, withoutFirstPositional(tail, sub));
    }

    case "entity": {
      const parsed = parseArgs(tail);
      const sub = parsed.positionals[0];
      if (wantsHelp && !sub) {
        console.log(HELP.entity);
        return 0;
      }
      const type = parsed.flags.type;
      if (!type) {
        console.error('entity requires --type <type>');
        console.error(HELP.entity);
        return 2;
      }
      return runEntity(rpcCtx, type, sub, withoutFirstPositional(tail, sub));
    }

    case "model": {
      const { positionals } = parseArgs(tail);
      const sub = positionals[0];
      if (wantsHelp && !sub) {
        console.log(HELP.model);
        return 0;
      }
      return runModel(lifecycleCtx, sub, withoutFirstPositional(tail, sub));
    }

    case "form": {
      const { positionals } = parseArgs(tail);
      const sub = positionals[0];
      if (wantsHelp && !sub) {
        console.log(HELP.form);
        return 0;
      }
      return runForm(lifecycleCtx, sub, withoutFirstPositional(tail, sub));
    }

    case "migrate": {
      if (wantsHelp) {
        console.log(HELP.migrate);
        return 0;
      }
      return runMigrate(lifecycleCtx, tail);
    }

    default:
      console.error(`unknown command "${command}"`);
      console.log(TOP_LEVEL_HELP);
      return 2;
  }
}

// Remove the (first) occurrence of the subcommand token from the tail so the
// command handler sees only its own args. Subcommands are positionals, so this
// strips the leading subcommand without disturbing flags.
function withoutFirstPositional(tail: string[], sub: string | undefined): string[] {
  if (!sub) return tail;
  const i = tail.indexOf(sub);
  if (i === -1) return tail;
  return [...tail.slice(0, i), ...tail.slice(i + 1)];
}

// Only run when invoked directly (not when imported by tests).
if (
  process.argv[1] &&
  import.meta.url === `file://${process.argv[1]}`
) {
  run(process.argv.slice(2)).then(
    (code) => process.exit(code),
    (e) => {
      console.error(e instanceof Error ? e.message : String(e));
      process.exit(1);
    },
  );
}
