import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme";
import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";
import { ApplicationFrame } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/application-frame";
import { ApplicationHeader } from "@com.mgmtp.a12.widgets/widgets-core/lib/application-header";
import { FlyoutMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";
import { TextField } from "@com.mgmtp.a12.widgets/widgets-core/lib/input";
import { PopUpMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/pop-up-menu";
import { List } from "@com.mgmtp.a12.widgets/widgets-core/lib/list";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon";

import { CONTENT_MODELS } from "./api/search";
import { liveSearchTarget } from "./lib/liveSearch";
import { BrowsePage } from "./pages/BrowsePage";
import { ViewPage } from "./pages/ViewPage";
import { EditPage } from "./pages/EditPage";
import { SearchPage } from "./pages/SearchPage";
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

// The single, global search box. It searches LIVE: as you type, a short debounce
// updates the shareable /search?q= route, and SearchPage re-runs unifiedSearch on
// every q change — so results stream in without pressing Enter. The first hop onto
// /search is a history push (one back-button entry for "started searching"); live
// keystroke updates replace, so back doesn't step through every query. Enter forces
// an immediate navigation. Seeded from the URL q so a loaded /search page shows its
// term. This is the only search affordance — Browse is a pure list-all gallery.
//
// The box's value persists across routes (it lives in the shell), so the effect also
// re-fires on route changes. `lastNav` + liveSearchTarget make a bare route change a
// no-op — otherwise leftover search text would trap the user on /search and make
// Browse (and its card-click detail) unreachable.
function HeaderSearch(): ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const lastNav = useRef((searchParams.get("q") ?? "").trim());

  useEffect(() => {
    const id = setTimeout(() => {
      const target = liveSearchTarget(value, location.pathname, lastNav.current);
      if (target) {
        lastNav.current = value.trim();
        navigate(target.to, { replace: target.replace });
      }
    }, 250);
    return () => clearTimeout(id);
  }, [value, location.pathname, navigate]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (q) {
          lastNav.current = q;
          navigate(`/search?q=${encodeURIComponent(q)}`);
        }
      }}
    >
      <TextField
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search…"
        inputProps={{ "aria-label": "Search content", type: "search" }}
      />
    </form>
  );
}

function Sidebar(): ReactElement {
  const navigate = useNavigate();
  const items = [
    { label: "Browse", onClick: () => navigate("/") },
    { label: "System", onClick: () => navigate("/system") },
  ];
  return <FlyoutMenu type="vertical" items={items} />;
}

// The content types you can create — derived from the known content models
// (model "Page_DM" → create-route type param "Page"), so a new type is offered
// automatically once it joins CONTENT_MODELS.
const NEW_TYPES = CONTENT_MODELS.map((m) => m.model.replace(/_DM$/, ""));

// "New" action in the header: a primary button that opens a dropdown to pick which
// content type to create, then routes to /create?type=<Type>. Replaces the old
// single "New page" sidebar entry (which could only ever make a page).
function NewButton(): ReactElement {
  const navigate = useNavigate();
  const closeRef = useRef<(() => void) | null>(null);
  return (
    <PopUpMenu
      triggerElement={<Button label="New" primary icon={<Icon>arrow_drop_down</Icon>} />}
      close={(handler) => {
        closeRef.current = handler;
      }}
    >
      <List>
        {NEW_TYPES.map((type) => (
          <List.Item
            key={type}
            text={type}
            graphic={<Icon>add</Icon>}
            onClick={() => {
              closeRef.current?.(); // dismiss the menu; the header persists across routes
              navigate(`/create?type=${type}`);
            }}
          />
        ))}
      </List>
    </PopUpMenu>
  );
}

function Shell(): ReactElement {
  return (
    <ApplicationFrame
      main={
        <ApplicationHeader
          leftSlots={<Link to="/" style={{ color: "inherit", textDecoration: "none", fontWeight: 700 }}>wiki12</Link>}
          rightSlots={
            <span style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem" }}>
              <HeaderSearch />
              <NewButton />
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
            <Route path="/search" element={<SearchPage />} />
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
