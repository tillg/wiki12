import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";

import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme";
import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";
import { ApplicationFrame } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/application-frame";
import { ApplicationHeader } from "@com.mgmtp.a12.widgets/widgets-core/lib/application-header";
import { FlyoutMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";

import { BrowsePage } from "./pages/BrowsePage";
import { ViewPage } from "./pages/ViewPage";
import { EditPage } from "./pages/EditPage";
import { SystemPage } from "./pages/SystemPage";
import { LoginPage } from "./pages/LoginPage";
import { getUser, isAuthenticated, logout, onAuthChange } from "./lib/auth.ts";

// Sans-serif everywhere. The A12 flat theme is already sans-serif for widget-rendered
// text; this layered global covers our own inline-styled components (cards, detail,
// Ui) so nothing falls back to the browser serif default. (createTheme's typography
// token isn't in the theme schema, so this global is the documented safe path.)
const SANS = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
const SansGlobal = createGlobalStyle`
  body, button, input, textarea, select { font-family: ${SANS}; }
`;

function Sidebar(): ReactElement {
  const navigate = useNavigate();
  const items = [
    { label: "Browse", onClick: () => navigate("/") },
    { label: "New page", onClick: () => navigate("/create?type=Page") },
    { label: "System", onClick: () => navigate("/system") },
  ];
  return <FlyoutMenu type="vertical" items={items} />;
}

function Shell(): ReactElement {
  return (
    <ApplicationFrame
      main={
        <ApplicationHeader
          leftSlots={<Link to="/" style={{ color: "inherit", textDecoration: "none", fontWeight: 700 }}>wiki12</Link>}
          rightSlots={
            <span style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem" }}>
              <span style={{ opacity: 0.8 }}>{getUser()}</span>
              <Button label="Log out" secondary onClick={() => logout()} />
            </span>
          }
        />
      }
      sub={<Sidebar />}
      subExpanded={true}
      content={
        <div style={{ padding: "1rem" }}>
          <Routes>
            <Route path="/" element={<BrowsePage />} />
            <Route path="/view/:ref" element={<ViewPage />} />
            <Route path="/edit/:ref" element={<EditPage />} />
            <Route path="/create" element={<EditPage />} />
            <Route path="/system" element={<SystemPage />} />
          </Routes>
        </div>
      }
    />
  );
}

export default function App(): ReactElement {
  const [authed, setAuthed] = useState(isAuthenticated());
  useEffect(() => onAuthChange(() => setAuthed(isAuthenticated())), []);
  return (
    <ThemeProvider theme={flatTheme}>
      <GlobalStyles />
      <SansGlobal />
      {authed ? (
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      ) : (
        <LoginPage />
      )}
    </ThemeProvider>
  );
}
