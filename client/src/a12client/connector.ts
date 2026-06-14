// A12 Client uses the ConnectorLocator singleton for ALL server traffic: the
// platform model loader (listModels/listValidationCodes) and the form-engine
// data providers (QUERY/ADD_DOCUMENT/MODIFY_DOCUMENT/DELETE_DOCUMENT) both go
// through ConnectorLocator.getInstance().getServerConnector().fetchData(...).
//
// The dataservices RPC builder posts to relativeUrl "/v2/rpc" (confirmed in
// @com.mgmtp.a12.dataservices/dataservices-access json-rpc builder), so the
// connector base URL must be "/api" → final URL "/api/v2/rpc", which is exactly
// wiki12's nginx/Vite proxy contract.
//
// Auth + locale are wiki12 concerns the connector doesn't know about, so we
// inject them with a RequestFilter: the same UAABearer token scheme and the
// mandatory `Accept-Language: en` that the hand-rolled api/* layer uses
// (A12 rejects the browser default locale — QA-LOG B12). // VERIFY against a
// running stack that the filter result is honoured by the default filter chain.
import {
  ConnectorLocator,
  RestServerConnector,
  type RequestFilter,
} from "@com.mgmtp.a12.utils/utils-connector";

import { getToken } from "../lib/auth";

const authAndLocaleFilter: RequestFilter = {
  canHandleRequest: () => true,
  doRequestFilter: ({ request }) => {
    const headers = new Headers(request.headers ?? undefined);
    headers.set("Accept-Language", "en");
    const token = getToken();
    if (token) headers.set("Authorization", `UAABearer ${token}`);
    return { request: { ...request, headers }, continue: true };
  },
};

let configured = false;

/** Idempotently install the wiki12 server connector as the ConnectorLocator singleton. */
export function setupConnector(): void {
  if (configured) return;
  ConnectorLocator.createInstance(new RestServerConnector("/api", [authAndLocaleFilter]));
  configured = true;
}
