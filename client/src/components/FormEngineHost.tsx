// EXPERIMENTAL — A12 form-engine integration (NOT currently wired into the app).
//
// Status (FORM-ENGINE-DECISIONS.md): document load (array-shaped GroupInstance +
// addTransientFields + parseDates + preProcessDocument) and read-back (formatDates
// + removeTransientFields + unwrap) are implemented per the kernel docs, and the
// VALUE_CHANGE dispatch wiring fires — but the engine's widget value binding does
// not two-way bind with our hand-generated form models. Until that's resolved, the
// app uses the model-driven `SimpleForm` for create/edit. This component is kept as
// the scaffold for finishing the proper A12 form-engine integration.
//
// Non-Redux bootstrap (formengine docs "Non-Redux Applications"): builds a private
// Redux store from (formModel + documentModel + validatorProvider + document),
// renders <EngineConnected/> inside <ScrollHandlerConnected/>. Milkdown is wired via
// markdownWidgetMap / markdownFormModelMap.

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { connect, Provider } from "react-redux";
import { applyMiddleware, legacy_createStore as createStore, type Store } from "redux";

import {
  createCombinedReducer,
  createEngineMiddlewares,
  createEngineStore,
  defaultMapDispatchToProps,
  defaultMapStateToProps,
  defaultValueParser,
  FormEngineRenderer,
  preProcessDocument,
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
  /** docRef of the existing document (used as the engine document id on edit). */
  initialDocId?: string;
  /** Receives a handle to read the current document for save. */
  onReady?: (handle: FormEngineHandle) => void;
}

export function FormEngineHost(props: FormEngineHostProps): ReactElement {
  const [error, setError] = useState<string | null>(null);
  const storeRef = useRef<Store | null>(null);
  // Kept for the read-back path (formatDates needs the model + a document service).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docModelRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docServiceRef = useRef<any>(null);
  const groupNameRef = useRef<string>("");

  const config: Partial<Config> = useMemo(
    () => ({
      widgetMap: markdownWidgetMap,
      formModelMap: markdownFormModelMap,
      cardView: true,
    }),
    [],
  );

  const store = useMemo(() => {
    try {
      const documentService = new DocumentServiceFactory().getDocumentService();
      const documentModel = new DocumentServiceFactory()
        .getDocumentModelSerializer()
        .deserialize(props.models.documentModelAsString);
      docModelRef.current = documentModel;
      docServiceRef.current = documentService;

      const validatorProvider = new GeneratedCodeAccessorFactory().createScriptAccessor(
        props.models.validationCode,
      );

      const formModel = unmarshallFormModel(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        props.models.formModelAsJson as any,
        documentModel,
        defaultValueParser(documentModel),
      );

      // Root group name (e.g. "Page"/"Location") from the DM JSON.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dmJson: any = JSON.parse(props.models.documentModelAsString);
      const groupName: string = dmJson?.content?.modelRoot?.rootGroups?.[0]?.name;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const modelIdFromModel: string = dmJson?.header?.id;

      // Build the engine document. The kernel represents groups as ARRAYS of
      // instances — `{ <Group>: [ {field: value} ] }` (kernel-documentation-dev
      // §"Representation of Groups"; example `{"RGx":[{...}]}`). The server returns
      // groups as plain OBJECTS, so we wrap them in arrays. The documented TS load
      // pipeline is addTransientFields -> parseDates (kernel-documentation-dev:165).
      // createEmptyDocument returned `{}` for our models (no group instance), which
      // is exactly why values never bound (QA-LOG B20). We therefore build the doc
      // explicitly with one root-group instance.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wrap = (v: any) => (Array.isArray(v) ? v : [v]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let document: any;
      if (props.initialDocument) {
        const src = props.initialDocument as Record<string, unknown>;
        const groupFields = (src[groupName] as Record<string, unknown>) ?? {};
        document = { [groupName]: wrap(groupFields) };
      } else {
        document = { [groupName]: [{}] };
      }
      document = documentService.addTransientFields(document, documentModel);
      document = documentService.parseDates(document, documentModel);
      document.id = props.initialDocId ?? "__NEW__";
      document.modelId = (props.initialDocId ?? "").split("/")[0] || modelIdFromModel || groupName;
      // Normalize via preProcessDocument (runs computations/dependencies and yields
      // the structure the value selectors read) — kernel/form-engine recipe.
      try {
        const pp = preProcessDocument({
          document,
          isNewInstance: !props.initialDocument,
          models: { formModel, documentModel, validatorProvider },
        });
        if (pp?.document) document = pp.document;
      } catch {
        /* preProcessDocument is best-effort; keep the assembled document */
      }
      groupNameRef.current = groupName;

      const initialState = createEngineStore({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { document: document as any },
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
        // Read-back (kernel TS recipe — kernel-documentation-dev:165): take
        // state.data.document, drop engine-only id/modelId, formatDates (Date->kernel
        // string), removeTransientFields, then UNWRAP the group arrays back to the
        // object form the Data Service expects: { <Group>: {...} } (QA-LOG B20).
        const state = store.getState() as { data?: { document?: Record<string, unknown> } };
        const doc = { ...(state.data?.document ?? {}) } as Record<string, unknown>;
        delete doc.id;
        delete doc.modelId;
        delete doc.__meta;
        const svc = docServiceRef.current;
        const model = docModelRef.current;
        let out = doc;
        if (svc && model) {
          out = svc.formatDates(out, model);
          out = svc.removeTransientFields(out, model);
        }
        // Unwrap `{ <Group>: [ {...} ] }` -> `{ <Group>: {...} }`.
        const unwrapped: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(out)) {
          unwrapped[k] = Array.isArray(v) ? (v[0] ?? {}) : v;
        }
        return unwrapped as ContentDocument;
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
