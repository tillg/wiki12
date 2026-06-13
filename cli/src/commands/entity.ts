// `wiki12 entity` — content CRUD over the Data Service. `wiki12 page` is sugar
// for `entity --type page`.
//
// Data Service ops (findings-a12.md §3, integration contract):
//   ADD_DOCUMENT  create        params { model, fields }
//   GET_DOCUMENT  read by ref   params { docRef }
//   QUERY         list/search   params { targetDocumentModel, query?, fields? }
//   <modify op>   update        params { docRef, fields }
//   <delete op>   delete        params { docRef }
//   UnifiedSearch (custom)      params { query, kind?, type? }
//
// VERIFY: exact op names for modify/delete and exact param keys
// (model vs targetDocumentModel, fields vs document) — assumed below.

import { parseArgs } from "../args.ts";
import { collectFields, formatHit, slugChangeMessage } from "../format.ts";
import { HELP } from "../help.ts";
import { modelName } from "../model-name.ts";
import { resolveDocRef } from "../resolve.ts";
import { RpcClient } from "../rpc.ts";
import type { ContentItem, SearchHit, WriteResult } from "../types.ts";

export interface CmdContext {
  rpc: RpcClient;
  out: (msg: string) => void;
  err: (msg: string) => void;
}

// VERIFY: op names for update/delete — assumed UPDATE_DOCUMENT / DELETE_DOCUMENT.
export const OP_CREATE = "ADD_DOCUMENT";
export const OP_READ = "GET_DOCUMENT";
export const OP_QUERY = "QUERY";
export const OP_UPDATE = "UPDATE_DOCUMENT";
export const OP_DELETE = "DELETE_DOCUMENT";
export const OP_UNIFIED_SEARCH = "UnifiedSearch";

// Run an entity subcommand. `type` is resolved by the caller (entity reads
// --type; page passes "page").
export async function runEntity(
  ctx: CmdContext,
  type: string,
  sub: string,
  rest: string[],
): Promise<number> {
  const { rpc, out, err } = ctx;
  const model = modelName(type);
  const parsed = parseArgs(rest);
  const ref = parsed.positionals[0];

  switch (sub) {
    case "list": {
      const items = await rpc.call<ContentItem[]>(OP_QUERY, {
        targetDocumentModel: model,
      });
      for (const it of items) out(`${it.slug}\t${it.id}`);
      return 0;
    }

    case "create": {
      const fields = collectFields(rest);
      const result = await rpc.call<WriteResult>(OP_CREATE, { model, fields });
      out(`Created ${result.slug}  (id ${result.id})`);
      return 0;
    }

    case "read": {
      if (!ref) return missingRef(err, type);
      const docRef = await resolveDocRef(rpc, type, ref);
      const item = await rpc.call<ContentItem>(OP_READ, { docRef });
      out(JSON.stringify(item, null, 2));
      return 0;
    }

    case "update": {
      if (!ref) return missingRef(err, type);
      const fields = collectFields(rest);
      const docRef = await resolveDocRef(rpc, type, ref);
      const result = await rpc.call<WriteResult>(OP_UPDATE, { docRef, fields });
      out(`Updated ${result.slug}  (id ${result.id})`);
      const msg = slugChangeMessage(result);
      if (msg) out(msg);
      return 0;
    }

    case "delete": {
      if (!ref) return missingRef(err, type);
      const docRef = await resolveDocRef(rpc, type, ref);
      await rpc.call(OP_DELETE, { docRef });
      out(`Deleted ${ref}`);
      return 0;
    }

    case "search": {
      const query = parsed.positionals.join(" ");
      if (!query) {
        err("usage: search <query>");
        return 2;
      }
      const hits = await rpc.call<SearchHit[]>(OP_UNIFIED_SEARCH, {
        query,
        type,
      });
      for (const hit of hits) out(formatHit(hit));
      return 0;
    }

    default:
      err(`unknown subcommand "${sub}"`);
      err(HELP.entity);
      return 2;
  }
}

function missingRef(err: (m: string) => void, type: string): number {
  err(`an id-or-slug is required (type "${type}")`);
  return 2;
}
