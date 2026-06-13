import type { ReactElement } from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter, Link, Route, Routes, useNavigate } from "react-router-dom";

import { GlobalStyles } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/base";
import { flatTheme } from "@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme";
import "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css";
import { ApplicationFrame } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/application-frame";
import { ApplicationHeader } from "@com.mgmtp.a12.widgets/widgets-core/lib/application-header";
import { FlyoutMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu";

import { SearchPage } from "./pages/SearchPage";
import { ViewPage } from "./pages/ViewPage";
import { EditPage } from "./pages/EditPage";
import { SystemPage } from "./pages/SystemPage";

function Sidebar(): ReactElement {
  const navigate = useNavigate();
  const items = [
    { label: "Search", onClick: () => navigate("/") },
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
        />
      }
      sub={<Sidebar />}
      subExpanded={true}
      content={
        <div style={{ padding: "1rem", maxWidth: "60rem" }}>
          <Routes>
            <Route path="/" element={<SearchPage />} />
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
  return (
    <ThemeProvider theme={flatTheme}>
      <GlobalStyles />
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </ThemeProvider>
  );
}
