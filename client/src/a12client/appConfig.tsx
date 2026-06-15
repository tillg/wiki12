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
import { addDataHandlers, addView } from "@com.mgmtp.a12.client/client-core";
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

import { appModel } from "./appModel";
import { wiki12LayoutProvider } from "./chrome/AppChrome";
import { BrowseView } from "./views/BrowseView";
import { FormScreen } from "./views/FormScreen";
import { SearchView } from "./views/SearchView";
import { SystemView } from "./views/SystemView";
import { createWikiSingleDocumentDataProvider } from "./wikiSingleDocumentDataProvider";

export function createWiki12Client() {
  const locale = { language: "en", country: "US" };

  const baseConfig: BaseConfig = {
    // Active locale — drives the form engine's value conversion (parseValue) and
    // localized labels. Without it, typed values convert to `undefined` and never
    // bind, and field labels render empty.
    locale,
    // wiki12 chrome is the custom ApplicationFrame layout (header search + New +
    // sidebar nav). Single frame — the entry renders the Client <Component> directly.
    layouts: wiki12LayoutProvider,
  };

  const initialConfig: A12ApplicationConfig = {
    config: baseConfig,
    // The Milkdown markdown widget is applied per-form by FormScreen (viewConfig),
    // so no global form-engine viewConfig is needed here.
    formEngine: {},
    localization: {
      supportedLocales: [locale],
      addLocaleChooser: "never",
    },
  };

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
  // Override the default "FormEngine" view with wiki12's FormScreen wrapper
  // (action bar + read-only handling). Registered after withFormEngineView so it wins.
  cfg = addView("FormEngine", FormScreen as never)(cfg);
  // Custom (non-form) screen views.
  cfg = addView("BrowseView", BrowseView as never)(cfg);
  cfg = addView("SearchView", SearchView as never)(cfg);
  cfg = addView("SystemView", SystemView as never)(cfg);
  cfg = withLocalization(cfg);
  cfg = withModel(appModel)(cfg);
  cfg = withPlatformModelLoader(cfg);

  return createA12ApplicationSetup(cfg);
}
