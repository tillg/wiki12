// Small plain UI primitives kept deliberately flat (theme refinement is later).

import type { ReactElement, ReactNode } from "react";

import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon";
import { Tag } from "@com.mgmtp.a12.widgets/widgets-core/lib/tag";
import { MessageBox } from "@com.mgmtp.a12.widgets/widgets-core/lib/message-box";

/** A small content label (e.g. the item's type). Renders the A12 Tag widget so
 *  styling comes from the theme — no hand-set colors. */
export function Chip(props: { children: ReactNode }): ReactElement {
  return <Tag>{props.children}</Tag>;
}

/** Inline message banner. The `kind` drives the A12 MessageBox `variant`, so the
 *  theme picks the colors (info/success/error) — meaning is encoded, not painted. */
export function Banner(props: {
  kind?: "info" | "success" | "error";
  onClose?: () => void;
  children: ReactNode;
}): ReactElement {
  return (
    <MessageBox
      variant={props.kind ?? "info"}
      label={props.children}
      action={
        props.onClose && (
          <Button
            icon={<Icon>close</Icon>}
            secondary
            title="Dismiss"
            buttonAttributes={{ "aria-label": "Dismiss" }}
            onClick={props.onClose}
          />
        )
      }
      style={{ margin: "0.5rem 0" }}
    />
  );
}

export function ConfirmDialog(props: {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}): ReactElement | null {
  if (!props.open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div style={{ background: "#fff", borderRadius: 4, padding: "1.25rem", width: "min(28rem, 90vw)" }}>
        <h3 style={{ marginTop: 0 }}>{props.title}</h3>
        <div style={{ marginBottom: "1rem" }}>{props.message}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
          <Button label="Cancel" secondary onClick={props.onCancel} />
          <Button label={props.confirmLabel ?? "Confirm"} destructive onClick={props.onConfirm} />
        </div>
      </div>
    </div>
  );
}
