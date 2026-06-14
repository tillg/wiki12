// `wiki12 entity` — content CRUD over the Data Service. `wiki12 page` is sugar
// for `entity --type page`.
//
// Data Service ops. Shapes confirmed against the validated web client
// (client/src/api/content.ts + search.ts, run against a live stack — QA-LOG
// B14/B21) and the custom-op server source (server/.../operation/*.java):
//   ADD_DOCUMENT     create   params { documentModelName, locale, document }
//                             -> result { docRef } (slug is server-derived, not returned)
//   GET_DOCUMENT     read     params { docRef } -> { document }
//   QUERY            list     params { query: { targetDocumentModel, projectionName, paging } }
//   MODIFY_DOCUMENT  update   params { docRef, document }  (NO documentModelName/locale — B21)
//                             -> void
//   DELETE_DOCUMENT  delete   params { docRef }
//   UnifiedSearch (custom)    params { query, kind?, type? } -> [{ kind,type,id,slug,title,snippet }]
//
// `document` is a group-keyed payload { <Group>: { ...fields } } (rootGroup());
// the flat --field pairs are wrapped before the write.

import { parseArgs } from "../args.ts";
import { collectFields, formatDocument, formatHit } from "../format.ts";
import { HELP } from "../help.ts";
import { modelName, rootGroup } from "../model-name.ts";
import { resolveDocRef } from "../resolve.ts";
import { RpcClient } from "../rpc.ts";
import type { ContentItem, SearchHit } from "../types.ts";

export interface CmdContext {
  rpc: RpcClient;
  out: (msg: string) => void;
  err: (msg: string) => void;
}

export const OP_CREATE = "ADD_DOCUMENT";
export const OP_READ = "GET_DOCUMENT";
export const OP_QUERY = "QUERY";
export const OP_MODIFY = "MODIFY_DOCUMENT";
export const OP_DELETE = "DELETE_DOCUMENT";
export const OP_UNIFIED_SEARCH = "UnifiedSearch";

// The A12 document locale; the web client hardcodes "en" on ADD_DOCUMENT.
const LOCALE = "en";

// Wrap flat --field pairs into the group-keyed document the Data Service expects.
function toDocument(type: string, fields: Record<string, string>): Record<string, unknown> {
  return { [rootGroup(type)]: fields };
}

// ADD_DOCUMENT returns the new document's reference, either as a bare
// "<Model>/<uuid>" string or as { docRef: "..." }. Extract the id (the part
// after "/"). Slugs are server-derived and not returned by the write.
function idFromDocRef(dref: string): string {
  const i = dref.indexOf("/");
  return i >= 0 ? dref.slice(i + 1) : dref;
}

function docRefOf(result: unknown): string {
  if (typeof result === "string") return result;
  if (result && typeof result === "object" && "docRef" in result) {
    return String((result as { docRef: unknown }).docRef ?? "");
  }
  return "";
}

// QUERY returns a PagedResultSet. Coerce the plausible envelopes (bare array,
// { content }, { results }) into a flat row list for `list` output.
// VERIFY: PagedResultSet envelope key (`content`) and the per-row {slug,id}
// projection shape against a live QUERY — handled defensively until confirmed.
function queryRows(rs: unknown): Array<{ slug?: string; id?: string }> {
  if (Array.isArray(rs)) return rs as Array<{ slug?: string; id?: string }>;
  if (rs && typeof rs === "object") {
    const o = rs as { content?: unknown[]; results?: unknown[] };
    if (Array.isArray(o.content)) return o.content as Array<{ slug?: string; id?: string }>;
    if (Array.isArray(o.results)) return o.results as Array<{ slug?: string; id?: string }>;
  }
  return [];
}

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
      // QUERY is a no-defaults protocol: the client must supply the full spec
      // (projection + paging), and results come back as a PagedResultSet.
      const rs = await rpc.call<unknown>(OP_QUERY, {
        query: {
          targetDocumentModel: model,
          projectionName: "document",
          paging: { pageSize: 100, pageNumber: 0 },
        },
      });
      for (const it of queryRows(rs)) out(`${it.slug ?? ""}\t${it.id ?? ""}`);
      return 0;
    }

    case "create": {
      const fields = collectFields(rest);
      const result = await rpc.call<unknown>(OP_CREATE, {
        documentModelName: model,
        locale: LOCALE,
        document: toDocument(type, fields),
      });
      const id = idFromDocRef(docRefOf(result));
      out(`Created ${model}/${id}`);
      return 0;
    }

    case "read": {
      if (!ref) return missingRef(err, type);
      const docRef = await resolveDocRef(rpc, type, ref);
      const item = await rpc.call<ContentItem>(OP_READ, { docRef });
      // The CLI ALWAYS returns the A12 document as its data format (envelope
      // fields — Title/Slug/CreatedOn/Changes — included). See CLAUDE.md.
      out(formatDocument(item));
      return 0;
    }

    case "update": {
      if (!ref) return missingRef(err, type);
      const fields = collectFields(rest);
      const docRef = await resolveDocRef(rpc, type, ref);
      // MODIFY_DOCUMENT returns void; it accepts ONLY { docRef, document }
      // (adding documentModelName/locale is rejected — QA-LOG B21).
      await rpc.call(OP_MODIFY, { docRef, document: toDocument(type, fields) });
      out(`Updated ${docRef}`);
      // Slug re-derivation on a key-field change is owned by the server-side
      // lifecycle listener; the write itself returns nothing, so any old->new
      // slug notification surfaces on the next read, not here.
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
