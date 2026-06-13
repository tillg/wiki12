import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During local dev (`npm run dev`) there is no nginx in front of the SPA, so we
// proxy the same-origin paths the production nginx serves (see nginx.conf.template).
// Override targets with VITE_DATA_SERVICE / VITE_MODEL_LIFECYCLE if needed.
const dataService = process.env.VITE_DATA_SERVICE ?? "http://localhost:8082";
const modelLifecycle = process.env.VITE_MODEL_LIFECYCLE ?? "http://localhost:8090";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": { target: dataService, changeOrigin: true },
      // nginx strips the /lifecycle prefix; mirror that here.
      "/lifecycle": {
        target: modelLifecycle,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/lifecycle/, ""),
      },
    },
  },
});
