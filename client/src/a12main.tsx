// Real entry for the wiki12 web client rebuilt on the A12 Client framework.
// (Served at /a12.html; the legacy React-Router SPA stays at /index.html until
// this reaches parity, per the rebuild plan.)
//
// Auth-gates on the existing UAA login, then mounts the A12 Client <Component>
// inside wiki12's own chrome (AppChrome), with URL↔activity routing.
import { StrictMode, useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";

import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme";
import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";

import { isAuthenticated, onAuthChange } from "./lib/auth";
import { LoginPage } from "./pages/LoginPage";
import { setupConnector } from "./a12client/connector";
import { createWiki12Client } from "./a12client/appConfig";
import { applyLocation, installPopstate, type Store } from "./a12client/routing";

// The ConnectorLocator can be configured up-front: the auth RequestFilter reads the
// token lazily per request, so it's fine to set up before login.
setupConnector();

interface ClientHandle {
  store: Store;
  Component: ReactElement;
}

function ClientApp(): ReactElement {
  const [handle, setHandle] = useState<ClientHandle | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return; // guard StrictMode double-invoke
    startedRef.current = true;
    const client = createWiki12Client();
    const store = client.store as unknown as Store;
    (window as unknown as { __wiki12Store?: unknown }).__wiki12Store = store;
    (async () => {
      await client.initialActions();
      await applyLocation(store); // create the activity for the initial URL
      installPopstate(store);
      setHandle({ store, Component: client.Component });
    })().catch((err) => console.error("[wiki12] client init failed", err));
  }, []);

  if (!handle) return <div style={{ padding: "1rem" }}>Loading…</div>;
  // The Client <Component> renders its own ApplicationFrame, whose layout is
  // wiki12's chrome (see appConfig `layouts`). Single frame — no extra wrapper.
  return <Provider store={handle.store as never}>{handle.Component}</Provider>;
}

function Root(): ReactElement {
  const [authed, setAuthed] = useState(isAuthenticated());
  useEffect(() => onAuthChange(() => setAuthed(isAuthenticated())), []);
  return (
    <ThemeProvider theme={flatTheme}>
      <GlobalStyles />
      {authed ? <ClientApp /> : <LoginPage />}
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
