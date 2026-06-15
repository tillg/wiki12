// The Application Model — declarative screenflow for the A12 Client, generated from
// CONTENT_MODELS so new content types appear automatically. Scene matching is on the
// activity descriptor's keys (set by routing.ts from the URL):
//   - Browse  : { model:"browse" }                      → BrowseView
//   - Search  : { model:"search", q, type }             → SearchView
//   - System  : { model:"system" }                      → SystemView
//   - Create  : { model:<Base>, mode:"create", instance:"__NEW__" } → FormEngine
//   - View    : { model:<Base>, mode:"view",   instance:<docRef> }  → FormEngine (read-only)
//   - Edit    : { model:<Base>, mode:"edit",   instance:<docRef> }  → FormEngine
// The form scenes carry the FM+DM so the platform model loader fetches them.
import type { ApplicationModel } from "@com.mgmtp.a12.client/client-core";

import { CONTENT_MODELS } from "../api/search";
import { baseModelName } from "./routing";

type Scene = NonNullable<ApplicationModel["content"]["modules"][number]["flows"]>[number]["scenes"][number];

function customViewScene(name: string, modelKey: string, viewName: string): Scene {
  return {
    name,
    matchConditions: [{ key: "model", mustEqual: modelKey }],
    sceneChange: {
      onEnter: [
        { type: "REGION_CLEAR", region: ["CONTENT"] },
        { type: "VIEW_ADD", region: ["CONTENT"], name: viewName },
      ],
    },
  };
}

function formScene(base: string, mode: string): Scene {
  const fm = `${base}_FM`;
  const dm = `${base}_DM`;
  return {
    name: `${mode} ${base}`,
    matchConditions: [
      { key: "model", mustEqual: base },
      { key: "mode", mustEqual: mode },
    ],
    sceneChange: {
      onEnter: [
        { type: "REGION_CLEAR", region: ["CONTENT"] },
        {
          type: "VIEW_ADD",
          region: ["CONTENT"],
          name: "FormEngine",
          models: [
            { modelType: "form", name: fm },
            { modelType: "document", name: dm },
          ],
        },
      ],
    },
  };
}

const bases = Array.from(new Set(CONTENT_MODELS.map((m) => baseModelName(m.model))));

const formScenes: Scene[] = bases.flatMap((base) => [
  formScene(base, "create"),
  formScene(base, "view"),
  formScene(base, "edit"),
]);

export const appModel: ApplicationModel = {
  header: {
    id: "wiki12-app",
    locales: [{ code: "en" }],
    modelType: "application",
    modelVersion: "4.0.0",
  },
  content: {
    // Root APP region. The A12 ApplicationFrame hosts the CONTENT region (the
    // active screen). wiki12's chrome (header/sidebar) is configured ON this frame
    // (see appConfig's custom ApplicationFrame layout), so there is a single frame.
    region: {
      name: "APP",
      layout: { name: "ApplicationFrame" },
      subRegions: [
        { name: "CONTENT", layout: { name: "MasterDetail" } },
        { name: "SIDEBAR", layout: { name: "Null" } },
        { name: "MODAL", layout: { name: "Stack" } },
      ],
    },
    defaultRegion: ["CONTENT"],
    initialActivity: { descriptor: { model: "browse" } },
    modules: [
      {
        name: "Content",
        flows: [
          {
            name: "Main",
            scenes: [
              customViewScene("Browse", "browse", "BrowseView"),
              customViewScene("Search", "search", "SearchView"),
              customViewScene("System", "system", "SystemView"),
              ...formScenes,
            ],
          },
        ],
      },
    ],
  },
};
