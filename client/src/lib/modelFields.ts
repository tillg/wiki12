// Helpers for the wiki12 model conventions (a12-model-format memory):
//   - the slug field is annotated wiki12.derived="slug"
//   - the markdown body is a StringType field; by convention named "Body"
//
// The MilkdownEditor binds to controls whose field is the markdown body. We
// detect that by the form-model control's field name / annotation rather than
// hard-coding, so it works for page + every entity type.

/** Annotation a control/field carries to mark it as the markdown body. */
export const MARKDOWN_BODY_ANNOTATION = "wiki12.markdownBody";

/** Fallback field names treated as the markdown body when no annotation present. */
export const DEFAULT_BODY_FIELD_NAMES = ["Body", "Description", "body", "description"];

interface AnnotationLike {
  name?: string;
  value?: unknown;
}

interface ControlLike {
  annotations?: AnnotationLike[];
  // The form model control references a field; the resolved field name is what
  // we match on. Shape is intentionally loose — the form engine's types vary by
  // version and we only read names.
  fieldName?: string;
  field?: { name?: string };
  // A generated form-model Control carries no field name, only an `elementRef`
  // (the DM element id, e.g. "F3") plus a runtime-only `elementPath` — a list of
  // `{ elementName }` segments whose last entry IS the bound DM field's NAME.
  // (Confirmed against @com.mgmtp.a12.formengine FormModel.FieldBasedInput +
  // base-model-api ModelPath: `[{ elementName }]`, last segment = leaf.)
  elementPath?: { elementName?: string }[];
}

/**
 * Resolve the NAME of the document-model field a form-model Control is bound to.
 * Generated Controls carry no `fieldName`/`field` — only `elementPath`, whose
 * last segment's `elementName` is the bound field's name. Falls back to the
 * legacy `fieldName`/`field.name` shapes for hand-authored controls. Pure.
 */
export function boundFieldName(control: ControlLike | undefined): string | undefined {
  if (!control) return undefined;
  const path = control.elementPath;
  if (path && path.length > 0) {
    const leaf = path[path.length - 1]?.elementName;
    if (leaf) return leaf;
  }
  return control.fieldName ?? control.field?.name;
}

/**
 * Decide whether a form-model control should render the Milkdown editor.
 * True when the control carries wiki12.markdownBody, OR its bound field name
 * (resolved via {@link boundFieldName}, incl. a generated control's elementPath)
 * is one of the known body field names. Pure — unit tested.
 */
export function isMarkdownBodyControl(control: ControlLike | undefined, fieldName?: string): boolean {
  if (control?.annotations?.some((a) => a.name === MARKDOWN_BODY_ANNOTATION)) return true;
  const name = fieldName ?? boundFieldName(control);
  return name != null && DEFAULT_BODY_FIELD_NAMES.includes(name);
}
