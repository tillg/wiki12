// URL ↔ activity sync. The A12 Client deep-linking feature is NOT a router (it only
// encodes the latest descriptor into the hash), so wiki12's path-based routes
// (`/`, `/view/:ref`, `/edit/:ref`, `/create?type=`, `/search?q=`, `/system`) are
// driven by this thin layer: it maps a URL to an Activity descriptor, creates that
// activity (the scene system swaps the CONTENT view), and keeps history in sync.
//
// One "current" activity at a time: each navigation cancels the previous activity
// and creates a new one with a unique id. Slug refs resolve via ResolveBySlug.
import { ActivityActions } from "@com.mgmtp.a12.client/client-core";

import { resolveRef } from "../api/content";
import { refFromParam, refSegment } from "../lib/refUrl";

// The A12 store dispatches typescript-fsa actions, which don't satisfy redux 5's
// UnknownAction index-signature constraint. A loose type avoids that friction.
export interface Store {
  dispatch: (action: unknown) => unknown;
  getState: () => unknown;
  subscribe: (listener: () => void) => () => void;
}

export interface Route {
  readonly descriptor: Record<string, string>;
  // ui slices applied at creation (e.g. read-only for View)
  readonly slices?: { ui?: { readonly?: boolean } };
}

/** type/model name → the descriptor `model` key (e.g. "Person_DM" → "Person"). */
export function baseModelName(typeOrModel: string): string {
  const t = typeOrModel.replace(/_DM$/i, "");
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Map the current location to an Activity descriptor (+ ui slices). Async because
 *  View/Edit refs may need slug→docRef resolution. */
export async function routeForLocation(pathname: string, search: string): Promise<Route> {
  const params = new URLSearchParams(search);

  if (pathname === "/" || pathname === "") return { descriptor: { model: "browse" } };
  if (pathname === "/system") return { descriptor: { model: "system" } };
  if (pathname === "/search") {
    return {
      descriptor: {
        model: "search",
        q: params.get("q") ?? "",
        type: params.get("type") ?? "",
      },
    };
  }
  if (pathname === "/create") {
    const type = params.get("type") ?? "Page";
    return { descriptor: { model: baseModelName(type), mode: "create", instance: "__NEW__" } };
  }

  const viewMatch = pathname.match(/^\/(view|edit)\/(.+)$/);
  if (viewMatch) {
    const mode = viewMatch[1] === "view" ? "view" : "edit";
    const ref = refFromParam(viewMatch[2]);
    const resolved = await resolveRef(ref);
    const model = baseModelName(resolved.type || "Page_DM");
    const instance = resolved.found ? `${resolved.type}/${resolved.id}` : ref;
    return {
      descriptor: { model, mode, instance },
      slices: mode === "view" ? { ui: { readonly: true } } : undefined,
    };
  }

  // Unknown path → Browse.
  return { descriptor: { model: "browse" } };
}

let counter = 0;
let currentActivityId: string | undefined;

/** Create the activity for the current URL, cancelling the previous one. */
export async function applyLocation(store: Store): Promise<void> {
  const route = await routeForLocation(window.location.pathname, window.location.search);
  const previous = currentActivityId;
  const id = `screen-${counter++}`;
  currentActivityId = id;
  store.dispatch(
    ActivityActions.create({
      activityId: id,
      activityDescriptor: route.descriptor,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(route.slices ? { slices: route.slices as any } : {}),
    }),
  );
  if (previous) {
    store.dispatch(ActivityActions.cancelRequested({ activityIds: [previous] }));
  }
}

/** Navigate to a path: push history + swap the active activity. */
export function navigate(store: Store, to: string, replace = false): void {
  if (replace) window.history.replaceState({}, "", to);
  else window.history.pushState({}, "", to);
  void applyLocation(store);
}

/** Build the canonical /view URL for a ref (slug verbatim, colon-literal). */
export function viewUrl(ref: string): string {
  return `/view/${refSegment(ref)}`;
}

/** Build the canonical /edit URL for a ref. */
export function editUrl(ref: string): string {
  return `/edit/${refSegment(ref)}`;
}

/** Wire browser back/forward to re-apply the location. Returns an unsubscribe. */
export function installPopstate(store: Store): () => void {
  const handler = () => void applyLocation(store);
  window.addEventListener("popstate", handler);
  return () => window.removeEventListener("popstate", handler);
}
