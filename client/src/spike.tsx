// Stage-0 binding spike entry (specs/changes/a12-client-rebuild/plan.md §0).
// Mounts the A12 Client app with a single Create-Person activity. Proves THE BET:
// typing into Form-Engine fields persists to the store, the BirthDate DatePicker
// binds a real Date, and Save → ADD_DOCUMENT sends a populated document that the
// kernel accepts. If this works, the rebuild proceeds; if not, STOP and reassess.
//
// Served by Vite dev at /spike.html (separate from the working /index.html SPA).
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";

import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme";
import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";

import { ActivityActions } from "@com.mgmtp.a12.client/client-core";

import { login } from "./lib/auth";
import { setupConnector } from "./a12client/connector";
import { createWiki12Client } from "./a12client/appConfig";

async function bootstrap(): Promise<void> {
  // Baseline seeds admin/admin; auth isn't enforced but the token is attached.
  await login("admin", "admin");
  setupConnector();

  const { store, initialActions, Component } = createWiki12Client();
  // Expose for in-browser inspection of the bound document during the spike.
  const w = window as unknown as { __wiki12Store?: unknown; __save?: () => void };
  w.__wiki12Store = store;
  // Spike helper: trigger the data-provider save (ADD_DOCUMENT) for the activity.
  w.__save = () => store.dispatch(ActivityActions.save.started({ activityId: "create-person" }));

  await initialActions();

  // Start the Create-Person activity. The descriptor matches the "Create Person"
  // scene (model=Person), which fires VIEW_ADD "FormEngine" + loads Person_FM/_DM.
  store.dispatch(
    ActivityActions.create({
      activityId: "create-person",
      activityDescriptor: { model: "Person", instance: "__NEW__" },
    }),
  );

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ThemeProvider theme={flatTheme}>
        <GlobalStyles />
        <Provider store={store}>{Component}</Provider>
      </ThemeProvider>
    </StrictMode>,
  );
}

bootstrap().catch((err) => {
  console.error("[spike] bootstrap failed", err);
  const root = document.getElementById("root");
  if (root) root.textContent = `Spike bootstrap failed: ${String(err)}`;
});
