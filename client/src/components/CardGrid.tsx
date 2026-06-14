// Responsive grid layout for content cards. Owns layout only, never data —
// cards flow into as many columns as the width allows and wrap into rows.

import type { CSSProperties, ReactElement, ReactNode } from "react";

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(16rem, 1fr))",
  gap: "1rem",
};

export function CardGrid(props: { children: ReactNode }): ReactElement {
  return <div style={gridStyle}>{props.children}</div>;
}
