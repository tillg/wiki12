// HTTP client for the model-lifecycle service.
//
// Contract (task integration contract; architecture §2/§5):
//   {WIKI12_MODEL_LIFECYCLE_URL} with routes:
//     POST /models                 upload data model + its Migration (gated)
//     GET/PUT /form-model/:type     read / write a form model
//     POST /migrate                 { type, from, to, dryRun } -> report
//     GET/PUT /migrations           list / write migration items
//
// The transport is injectable so tests can mock it; the default uses fetch.

import type { HttpRequest, HttpResponse, HttpTransport } from "./types.ts";

export const DEFAULT_MODEL_LIFECYCLE_URL = "http://localhost:8090";

export function modelLifecycleUrl(
  env: NodeJS.ProcessEnv = process.env,
): string {
  return env.WIKI12_MODEL_LIFECYCLE_URL ?? DEFAULT_MODEL_LIFECYCLE_URL;
}

// Default transport: fetch against the model-lifecycle base URL.
export function fetchHttpTransport(baseUrl: string): HttpTransport {
  return async (req: HttpRequest): Promise<HttpResponse> => {
    const res = await fetch(`${baseUrl}${req.path}`, {
      method: req.method,
      headers:
        req.body !== undefined
          ? { "content-type": "application/json" }
          : undefined,
      body: req.body !== undefined ? JSON.stringify(req.body) : undefined,
    });
    const text = await res.text();
    const body = text ? JSON.parse(text) : undefined;
    if (!res.ok) {
      throw new Error(
        `Model-lifecycle HTTP ${res.status} ${res.statusText} for ${req.method} ${req.path}`,
      );
    }
    return { status: res.status, body };
  };
}

export class LifecycleClient {
  private readonly transport: HttpTransport;

  constructor(transport: HttpTransport) {
    this.transport = transport;
  }

  // Build a request without sending — exposed for testing the request shape.
  buildRequest(
    method: HttpRequest["method"],
    path: string,
    body?: unknown,
  ): HttpRequest {
    return { method, path, body };
  }

  async send<T = unknown>(
    method: HttpRequest["method"],
    path: string,
    body?: unknown,
  ): Promise<T> {
    const res = await this.transport(this.buildRequest(method, path, body));
    return res.body as T;
  }
}
