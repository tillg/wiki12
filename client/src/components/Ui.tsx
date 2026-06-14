// Small plain UI primitives kept deliberately flat (theme refinement is later).

import type { ReactElement, ReactNode } from "react";

import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";

export function Chip(props: { children: ReactNode; tone?: "kind" | "type" }): ReactElement {
  const bg = props.tone === "kind" ? "#e6eef7" : "#eef3e6";
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "0.72rem",
        padding: "0.1rem 0.45rem",
        borderRadius: 3,
        background: bg,
        border: "1px solid #ccc",
        marginRight: "0.35rem",
        whiteSpace: "nowrap",
      }}
    >
      {props.children}
    </span>
  );
}

export function Banner(props: {
  kind?: "info" | "success" | "error";
  onClose?: () => void;
  children: ReactNode;
}): ReactElement {
  const palette = {
    info: { bg: "#eef3fb", border: "#b9cdec" },
    success: { bg: "#eef8ef", border: "#bfe0c1" },
    error: { bg: "#fbeeee", border: "#ecbcbc" },
  }[props.kind ?? "info"];
  return (
    <div
      role="status"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 3,
        padding: "0.5rem 0.75rem",
        margin: "0.5rem 0",
        fontSize: "0.9rem",
      }}
    >
      <span>{props.children}</span>
      {props.onClose && <Button label="×" secondary title="Dismiss" onClick={props.onClose} />}
    </div>
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
