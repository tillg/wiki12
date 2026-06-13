// Non-Redux form engine bootstrap (formengine docs "Non-Redux Applications").
//
// Builds a private Redux store from (formModel + documentModel + validatorProvider
// + document), renders <EngineConnected/> inside <ScrollHandlerConnected/>, and
// exposes a way to read the current document back out for save.
//
// The Milkdown custom widget is wired via the markdownWidgetMap / markdownFormModelMap
// passed in the engine Config.

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { connect, Provider } from "react-redux";
import { applyMiddleware, legacy_createStore as createStore, type Store } from "redux";

import {
  createCombinedReducer,
  createEmptyDocument,
  createEngineMiddlewares,
  createEngineStore,
  defaultMapDispatchToProps,
  defaultMapStateToProps,
  defaultValueParser,
  FormEngineRenderer,
  ScrollHandler,
  unmarshallFormModel,
  type Config,
  type DefaultDispatchProps,
  type DefaultOwnProps,
  type DefaultStateProps,
  type EngineState,
  type ScrollHandlerProps,
} from "@com.mgmtp.a12.formengine/formengine-core";
import { DocumentServiceFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";
import { GeneratedCodeAccessorFactory } from "@com.mgmtp.a12.kernel/kernel-md-facade/lib/main/js/facade.js";
import { Locale } from "@com.mgmtp.a12.utils/utils-localization/lib/main/index.js";

import { markdownFormModelMap, markdownWidgetMap } from "../widgets/markdownWidgetMap";
import type { LoadedModels } from "../api/models";
import type { ContentDocument } from "../api/content";

const EngineConnected = connect<DefaultStateProps, DefaultDispatchProps, DefaultOwnProps, EngineState>(
  defaultMapStateToProps,
  defaultMapDispatchToProps,
)(FormEngineRenderer);

const ScrollHandlerConnected = connect<ScrollHandlerProps, object, { children?: ReactNode }, EngineState>(
  (state) => ({ uiState: state.ui, models: state.models }),
)(ScrollHandler);

export interface FormEngineHandle {
  /** Read the current edited document payload out of the engine store. */
  getDocument(): ContentDocument;
}

export interface FormEngineHostProps {
  models: LoadedModels;
  /** Existing document to edit; omit/undefined for a create form. */
  initialDocument?: ContentDocument;
  /** Receives a handle to read the current document for save. */
  onReady?: (handle: FormEngineHandle) => void;
}

export function FormEngineHost(props: FormEngineHostProps): ReactElement {
  const [error, setError] = useState<string | null>(null);
  const storeRef = useRef<Store | null>(null);

  const config: Partial<Config> = useMemo(
    () => ({
      // Register the Milkdown custom widget (both maps must be provided together).
      widgetMap: markdownWidgetMap,
      formModelMap: markdownFormModelMap,
      cardView: true,
    }),
    [],
  );

  const store = useMemo(() => {
    try {
      const documentModel = new DocumentServiceFactory()
        .getDocumentModelSerializer()
        .deserialize(props.models.documentModelAsString);

      const validatorProvider = new GeneratedCodeAccessorFactory().createScriptAccessor(
        props.models.validationCode,
      );

      const formModel = unmarshallFormModel(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        props.models.formModelAsJson as any,
        documentModel,
        defaultValueParser(documentModel),
      );

      // VERIFY: how to seed an EXISTING document. The docs show createEmptyDocument
      // for new docs; for edit we start empty then expect the engine to accept the
      // loaded payload as the data.document. Here we pass initialDocument when given.
      const document =
        (props.initialDocument as unknown) ?? createEmptyDocument(documentModel, formModel);

      const initialState = createEngineStore({
        data: { document },
        locale: Locale.fromString("en_US") as Locale,
        models: { formModel, documentModel, validatorProvider },
      });

      const storeEnhancer = applyMiddleware(...createEngineMiddlewares());
      const reducer = createCombinedReducer(initialState);
      const s = createStore(reducer, initialState, storeEnhancer);
      storeRef.current = s;
      return s;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return null;
    }
  }, [props.models, props.initialDocument]);

  useEffect(() => {
    if (!store) return;
    props.onReady?.({
      getDocument(): ContentDocument {
        // VERIFY: the exact path to the document in the engine state
        // (assumed state.data.document). Centralized here on purpose.
        const state = store.getState() as { data?: { document?: ContentDocument } };
        return state.data?.document ?? {};
      },
    });
  }, [store, props]);

  if (error) {
    return <div style={{ color: "#b00", padding: "1rem" }}>Form failed to load: {error}</div>;
  }
  if (!store) return <div style={{ padding: "1rem" }}>Loading form…</div>;

  return (
    <Provider store={store}>
      <ScrollHandlerConnected>
        <EngineConnected config={config} />
      </ScrollHandlerConnected>
    </Provider>
  );
}
