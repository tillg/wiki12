// The Application Model — declarative screenflow for the A12 Client. Stage 0 of
// the rebuild (specs/changes/a12-client-rebuild/plan.md): prove Form-Engine
// binding inside the Client with ONE Create-Person activity. Later stages add
// Browse/View/Edit/Search/System scenes here.
//
// Scene matching is on the activity descriptor's keys. `model: "Person"` selects
// this scene; the Form Engine view ("FormEngine", registered by withFormEngine)
// renders into the CONTENT region. The `models` on the VIEW_ADD tell the platform
// model loader which models to fetch — the FM, and the DM it references (so its
// validationCode loads too). createEmptyDocument needs both.
import type { ApplicationModel } from "@com.mgmtp.a12.client/client-core";

export const appModel: ApplicationModel = {
  header: {
    id: "wiki12-app",
    locales: [{ code: "en" }],
    modelType: "application",
    // VERIFY: 4.0.0 is the version in the client docs example; confirm the
    // installed client-core accepts it (ApplicationModel.isInstance).
    modelVersion: "4.0.0",
  },
  content: {
    region: {
      name: "APP",
      layout: { name: "ApplicationFrame" },
      // ApplicationFrame expects CONTENT + SIDEBAR (+ MODAL for dialogs).
      subRegions: [
        { name: "CONTENT", layout: { name: "MasterDetail" } },
        { name: "SIDEBAR", layout: { name: "Null" } },
        { name: "MODAL", layout: { name: "Stack" } },
      ],
    },
    defaultRegion: ["CONTENT"],
    // Auto-start the Create-Person activity on boot (the Stage-0 spike target).
    initialActivity: { descriptor: { model: "Person", instance: "__NEW__" } },
    modules: [
      {
        name: "Content",
        flows: [
          {
            name: "Person Flow",
            scenes: [
              {
                name: "Create Person",
                matchConditions: [{ key: "model", mustEqual: "Person" }],
                sceneChange: {
                  onEnter: [
                    { type: "REGION_CLEAR", region: ["CONTENT"] },
                    {
                      type: "VIEW_ADD",
                      region: ["CONTENT"],
                      name: "FormEngine",
                      models: [
                        { modelType: "form", name: "Person_FM" },
                        { modelType: "document", name: "Person_DM" },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  },
};
