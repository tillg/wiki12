// Minimal A12 model types — only the parts the generator reads/writes.
// Reverse-engineered from real models in docs/a12/sample-models/reference/.

export interface Locale { code: string; }
export interface LabelText { locale: string; text: string; }
export interface Annotation { name: string; value: string; }

export interface Multilingual {
  type: "Multilingual";
  multilingualText: { text: LabelText[] };
}

// ---- Document Model (input) ----
export interface DMHeader {
  id: string;
  modelType: "document";
  modelVersion: string;
  locales: Locale[];
  labels: LabelText[];
  annotations: Annotation[];
  modelReferences: unknown[];
}
export interface DMElement {
  type: string; // "Group" | "Field" | "Rule" | ...
  id: string;
  name: string;
  // the detail object is keyed by `type`, e.g. Group / Field
  [key: string]: unknown;
}
export interface DMGroupDetail { repeatability: unknown; elements: DMElement[]; }
export interface DocumentModel {
  header: DMHeader;
  content: {
    modelInfo: { name: string; immutable: boolean };
    modelConfig: unknown;
    modelRoot: { rootGroups: DMElement[] };
  };
}

// ---- Form Model (output) ----
export interface Control { type: "Control"; id: string; elementRef: string; }
export interface Row { type: "Row"; id: string; name: string; cell: Control[]; }
export interface ControlGrid {
  type: "ControlGrid"; id: string; name: string;
  layout: { lg: string }; row: Row[];
}
export interface Section {
  type: "MultiColumnSection"; id: string; name: string;
  title: Multilingual; layout: { lg: string }; screenElements: ControlGrid[];
}
export interface Screen { id: string; name: string; screenElements: Section[]; }

export interface FormModel {
  header: {
    id: string;
    modelType: "form";
    modelVersion: string;
    locales: Locale[];
    labels: LabelText[];
    annotations: Annotation[];
    modelReferences: { alias: string; modelType: "document"; purpose: "data binding"; reference: string }[];
  };
  content: {
    footerBox: unknown;
    screens: Screen[];
    fieldConfiguration: { field: unknown[] };
    groupConfiguration: Record<string, unknown>;
    defaults: unknown;
  };
}
