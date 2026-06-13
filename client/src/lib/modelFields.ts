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
}

/**
 * Decide whether a form-model control should render the Milkdown editor.
 * True when the control carries wiki12.markdownBody, OR its bound field name is
 * one of the known body field names. Pure — unit tested.
 */
export function isMarkdownBodyControl(control: ControlLike | undefined, fieldName?: string): boolean {
  if (control?.annotations?.some((a) => a.name === MARKDOWN_BODY_ANNOTATION)) return true;
  const name = fieldName ?? control?.fieldName ?? control?.field?.name;
  return name != null && DEFAULT_BODY_FIELD_NAMES.includes(name);
}
