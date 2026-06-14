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
import { withPlatformModelLoader } from "@com.mgmtp.a12.client/client-core/modelLoader";
import { withLocalization } from "@com.mgmtp.a12.client/client-core/localization";
import { withFormEngine } from "@com.mgmtp.a12.formengine/formengine-core";

import { markdownFormModelMap, markdownWidgetMap } from "../widgets/markdownWidgetMap";
import { appModel } from "./appModel";

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

  // Order is type-enforced: withFormEngine requires that NEITHER `formEngine`
  // nor `modelLoader` is configured yet, so it must come first; localization,
  // model and the model loader follow. We apply the transformers sequentially
  // (rather than via combineFeatures) because the `flow`-typed combinator can't
  // infer through these heavily-generic feature signatures.
  const withFe = withFormEngine(initialConfig);
  const withLoc = withLocalization(withFe);
  const withMdl = withModel(appModel)(withLoc);
  const finalConfig = withPlatformModelLoader(withMdl);

  return createA12ApplicationSetup(finalConfig);
}
