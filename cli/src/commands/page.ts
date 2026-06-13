// `wiki12 page` — sugar for `wiki12 entity --type page`.

import { HELP } from "../help.ts";
import { runEntity, type CmdContext } from "./entity.ts";

export async function runPage(
  ctx: CmdContext,
  sub: string,
  rest: string[],
): Promise<number> {
  if (!sub) {
    ctx.err(HELP.page);
    return 2;
  }
  // Page is literally entity with type fixed to "page".
  return runEntity(ctx, "page", sub, rest);
}
