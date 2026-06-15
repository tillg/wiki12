// System screen — a custom A12 Client view (registered as "SystemView"). The
// existing SystemPage is router-free and self-contained (Keycloak link + migration
// editor over the model-lifecycle HTTP API), so it's reused verbatim.
import type { ReactElement } from "react";

import { SystemPage } from "../../pages/SystemPage";

export function SystemView(): ReactElement {
  return (
    <div style={{ padding: "1rem" }}>
      <SystemPage />
    </div>
  );
}
