// wiki12 chrome, provided as the A12 Client's ApplicationFrame layout (a SINGLE
// frame — we don't wrap the Client in another frame, which collapses the layout).
// The custom layout renders the default FrameViews.ApplicationFrameLayout with:
//   - logo  → wiki12 brand (→ Browse)
//   - additionalHeaderItems → live search box + New type dropdown + user + logout
//   - mainMenuComponent → sidebar nav (Browse, System)
// All navigation drives the URL↔activity sync in routing.ts.
import { useRef } from "react";
import type { ReactElement } from "react";
import { useStore } from "react-redux";

import { FrameFactories, FrameViews } from "@com.mgmtp.a12.client/client-core";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";
import { TextField } from "@com.mgmtp.a12.widgets/widgets-core/lib/input";
import { PopUpMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/pop-up-menu";
import { List } from "@com.mgmtp.a12.widgets/widgets-core/lib/list";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon";
import { FlyoutMenu } from "@com.mgmtp.a12.widgets/widgets-core/lib/menu";

import { useEffect, useState } from "react";
import { CONTENT_MODELS } from "../../api/search";
import { liveSearchTarget } from "../../lib/liveSearch";
import { getUser, logout } from "../../lib/auth";
import { navigate, type Store } from "../routing";

function useStoreLoose(): Store {
  return useStore() as unknown as Store;
}

function HeaderSearch(): ReactElement {
  const store = useStoreLoose();
  const initialQ = new URLSearchParams(window.location.search).get("q") ?? "";
  const [value, setValue] = useState(initialQ);
  const lastNav = useRef(initialQ.trim());
  useEffect(() => {
    const id = setTimeout(() => {
      const target = liveSearchTarget(value, window.location.pathname, lastNav.current);
      if (target) {
        lastNav.current = value.trim();
        navigate(store, target.to, target.replace);
      }
    }, 250);
    return () => clearTimeout(id);
  }, [value, store]);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (q) {
          lastNav.current = q;
          navigate(store, `/search?q=${encodeURIComponent(q)}`);
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

const NEW_TYPES = CONTENT_MODELS.map((m) => m.model.replace(/_DM$/, ""));

function NewButton(): ReactElement {
  const store = useStoreLoose();
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
              closeRef.current?.();
              navigate(store, `/create?type=${type}`);
            }}
          />
        ))}
      </List>
    </PopUpMenu>
  );
}

function Brand(): ReactElement {
  const store = useStoreLoose();
  return (
    <a
      href="/"
      onClick={(e) => {
        e.preventDefault();
        navigate(store, "/");
      }}
      style={{ color: "inherit", textDecoration: "none", fontWeight: 700, fontSize: "1.1rem" }}
    >
      wiki12
    </a>
  );
}

function makeSidebar() {
  return function SidebarMenu(props: { onMenuItemClick?: () => void }): ReactElement {
    const store = useStoreLoose();
    const go = (to: string) => {
      props.onMenuItemClick?.();
      navigate(store, to);
    };
    return (
      <FlyoutMenu
        type="vertical"
        items={[
          { label: "Browse", onClick: () => go("/") },
          { label: "System", onClick: () => go("/system") },
        ]}
      />
    );
  };
}

const SidebarMenu = makeSidebar();

/** The custom ApplicationFrame layout = wiki12's chrome. */
function Wiki12Frame(props: FrameViews.ApplicationFrameLayoutProps): ReactElement {
  return (
    <FrameViews.ApplicationFrameLayout
      {...props}
      logo={<Brand />}
      additionalHeaderItems={[
        { item: <HeaderSearch />, orientation: "rightSlots-left" },
        { item: <NewButton />, orientation: "rightSlots-left" },
        {
          item: <span style={{ opacity: 0.8, fontSize: "0.85rem" }}>{getUser()}</span>,
          orientation: "rightSlots-left",
        },
        {
          item: <Button label="Log out" secondary onClick={() => logout()} />,
          orientation: "rightSlots-left",
        },
      ]}
      mainMenuComponent={SidebarMenu as never}
    />
  );
}

/** Layout provider: override "ApplicationFrame" with wiki12's chrome; everything
 *  else falls through to the A12 defaults. */
export const wiki12LayoutProvider: FrameViews.LayoutProvider = (name) =>
  name === "ApplicationFrame"
    ? { component: Wiki12Frame }
    : FrameFactories.layoutProvider(name);
