// Reusable playing-card component for a single content item.
// Built on the A12 Card widget; depends only on ContentCardData + onOpen
// (no router, no fetch, no gallery coupling) so any listing can reuse it.

import type { CSSProperties, KeyboardEvent, ReactElement } from "react";
import { Card } from "@com.mgmtp.a12.widgets/widgets-core/lib/card";
import type { ContentCardData } from "../api/search";
import { formatCardDates } from "../api/search";
import { Chip } from "./Ui";

const cardStyle: CSSProperties = {
  borderRadius: 6,
  border: "1px solid #e2e2e2",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  minHeight: 140,
  background: "#fff",
  cursor: "pointer",
};

const contentStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  padding: "0.85rem",
};

const dateLineStyle: CSSProperties = {
  fontSize: "0.72rem",
  color: "#888",
};

const titleStyle: CSSProperties = {
  fontWeight: 700,
  fontSize: "1.05rem",
};

const snippetStyle: CSSProperties = {
  fontSize: "0.9rem",
  color: "#444",
  display: "-webkit-box",
  WebkitLineClamp: 4,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

export function ContentCard(props: {
  item: ContentCardData;
  onOpen: (item: ContentCardData) => void;
}): ReactElement {
  const { item, onOpen } = props;
  const dates = formatCardDates(item.createdOn, item.lastChangedOn);

  return (
    <Card style={cardStyle}>
      <Card.ActionArea
        onClick={() => onOpen(item)}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") onOpen(item);
        }}
      >
        <Card.Content style={contentStyle}>
          {dates && <div style={dateLineStyle}>{dates}</div>}
          {/* Top row: Title (left) with the Type chip at the right edge.
              Type only (no kind chip) — domain.md §Content Card. */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
            <div style={titleStyle}>{item.title}</div>
            <span style={{ flexShrink: 0 }}>
              <Chip tone="type">{item.type}</Chip>
            </span>
          </div>
          {item.snippet && <div style={snippetStyle}>{item.snippet}</div>}
        </Card.Content>
      </Card.ActionArea>
    </Card>
  );
}
