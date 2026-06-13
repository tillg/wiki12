// Entrypoint: wire the real HTTP transport + start the server.
//
//   node --experimental-strip-types src/server.ts
//
// Env:
//   MODEL_LIFECYCLE_PORT   listen port (default 8090)
//   WIKI12_DATA_SERVICE_URL Data Service base URL (default http://data-service:8080)
//   WIKI12_VERSION         reported by GET /health (default from package/0.1.0)

import http from "node:http";
import process from "node:process";
import { createApp } from "./app.ts";
import { DataService, httpTransport } from "./dataservice.ts";
import { Registry } from "./registry.ts";

const port = Number(process.env.MODEL_LIFECYCLE_PORT ?? 8090);
const dataServiceUrl = process.env.WIKI12_DATA_SERVICE_URL ?? "http://data-service:8080";
const version = process.env.WIKI12_VERSION ?? "0.1.0";

const registry = new Registry();
const dataService = new DataService(httpTransport(dataServiceUrl));
const app = createApp({ registry, dataService, version });

const server = http.createServer((req, res) => {
  void app(req, res);
});

server.listen(port, () => {
  console.log(`[model-lifecycle] v${version} listening on :${port} (data-service: ${dataServiceUrl})`);
});
