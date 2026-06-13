/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";

// Standalone Vitest config (no Vite React plugin) so the pure-logic unit tests
// run without the A12 packages installed. Component tests would use vite.config.ts.
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
