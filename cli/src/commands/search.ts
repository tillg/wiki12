// `wiki12 search <query> [--kind page|entity] [--type <type>]`
//
// Unified search across all content via the Data Service custom op
// UnifiedSearch({ query, kind?, type? }) -> [{ kind, type, id, slug, title,
// snippet }].

import { parseArgs } from "../args.ts";
import { formatHit } from "../format.ts";
import { OP_UNIFIED_SEARCH, type CmdContext } from "./entity.ts";
import type { SearchHit } from "../types.ts";

export async function runSearch(
  ctx: CmdContext,
  rest: string[],
): Promise<number> {
  const { rpc, out, err } = ctx;
  const parsed = parseArgs(rest);
  const query = parsed.positionals.join(" ");
  if (!query) {
    err("usage: wiki12 search <query> [--kind page|entity] [--type <type>]");
    return 2;
  }

  const params: Record<string, unknown> = { query };
  if (parsed.flags.kind) params.kind = parsed.flags.kind;
  if (parsed.flags.type) params.type = parsed.flags.type;

  const hits = await rpc.call<SearchHit[]>(OP_UNIFIED_SEARCH, params);
  for (const hit of hits) out(formatHit(hit));
  return 0;
}
