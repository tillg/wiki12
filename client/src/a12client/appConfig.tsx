// Composable Appsetup for the wiki12 A12 Client. Combines the feature
// transformers into the final A12ApplicationConfig and produces the
// { store, initialActions, Component } triple that main/spike mounts.
//
// - withModel(appModel)        — the declarative screenflow
// - withPlatformModelLoader    — loads models via RPC (listModels/listValidationCodes)
//                                through the ConnectorLocator (see connector.ts)
// - withFormEngine             — registers the "FormEngine" view + the
//                                createEmptyDocument & platform single-document
//                                data providers (the binding fix). Reads the
//                                `formEngine` config block below.
import {
  createA12ApplicationSetup,
  withModel,
  type A12ApplicationConfig,
  type BaseConfig,
} from "@com.mgmtp.a12.client/client-core";
import { addDataHandlers } from "@com.mgmtp.a12.client/client-core";
import { withPlatformModelLoader } from "@com.mgmtp.a12.client/client-core/modelLoader";
import { withLocalization } from "@com.mgmtp.a12.client/client-core/localization";
import {
  createEmptyDocumentDataProvider,
  withConfiguredFormEngine,
  withFormEngineDataReducers,
  withFormEngineMiddlewares,
  withFormEngineSagas,
  withFormEngineView,
  withFormModelSupport,
} from "@com.mgmtp.a12.formengine/formengine-core";

import { markdownFormModelMap, markdownWidgetMap } from "../widgets/markdownWidgetMap";
import { appModel } from "./appModel";
import { createWikiSingleDocumentDataProvider } from "./wikiSingleDocumentDataProvider";

export function createWiki12Client() {
  // SPIKE diagnostics: record every dispatched action type on window.__actions
  // so the browser test can see whether value-change events reach Redux.
  const actionLogger =
    () => (next: (a: unknown) => unknown) => (action: unknown) => {
      const w = window as unknown as { __actions?: string[]; __fullActions?: unknown[] };
      (w.__actions ??= []).push((action as { type?: string })?.type ?? "?");
      try {
        (w.__fullActions ??= []).push(JSON.parse(JSON.stringify(action)));
        if (w.__fullActions.length > 12) w.__fullActions.shift();
      } catch {
        /* non-serializable */
      }
      return next(action);
    };

  const locale = { language: "en", country: "US" };

  const baseConfig: BaseConfig = {
    additionalMiddlewares: [actionLogger as never],
    // Active locale — drives the form engine's value conversion (parseValue) and
    // localized labels. Without it, typed values convert to `undefined` and never
    // bind, and field labels render empty.
    locale,
  };

  const initialConfig: A12ApplicationConfig = {
    config: baseConfig,
    // NOTE: markdown widget map temporarily disabled while isolating the binding
    // spike — re-enable once binding is proven with engine defaults.
    formEngine: {},
    localization: {
      supportedLocales: [locale],
      addLocaleChooser: "never",
    },
  };
  void markdownWidgetMap;
  void markdownFormModelMap;

  // We compose the form engine from its individual features (NOT the bundled
  // `withFormEngine`) so we can swap the platform single-document provider for
  // wiki12's custom one (see wikiSingleDocumentDataProvider.ts). createEmptyDocument
  // still handles __NEW__ load; our provider handles load-existing/save/delete.
  // Order is type-enforced: these features require neither `formEngine` nor
  // `modelLoader` configured, so they precede the model + loader. Applied
  // sequentially because the `flow`-typed combinator can't infer through the
  // heavily-generic feature signatures.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cfg: any = initialConfig;
  cfg = withFormEngineDataReducers(cfg);
  cfg = withFormEngineMiddlewares(cfg);
  cfg = withFormEngineSagas(cfg);
  cfg = withFormEngineView(cfg);
  cfg = withConfiguredFormEngine(cfg);
  cfg = withFormModelSupport(cfg);
  cfg = addDataHandlers(
    createEmptyDocumentDataProvider(initialConfig.formEngine?.emptyDocument),
    createWikiSingleDocumentDataProvider(),
  )(cfg);
  cfg = withLocalization(cfg);
  cfg = withModel(appModel)(cfg);
  cfg = withPlatformModelLoader(cfg);

  return createA12ApplicationSetup(cfg);
}
