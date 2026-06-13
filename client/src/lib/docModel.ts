// Parse an A12 Document Model JSON into the editable-field list the simple form
// renders. We skip system/derived fields (Slug + anything annotated
// wiki12.derived = slug|searchText) since those are computed server-side.

export interface EditableField {
  name: string;
  label: string;
  multiline: boolean; // StringType with lineBreaksPermitted -> textarea (markdown body)
}

export interface DocModelInfo {
  groupName: string; // root group name (e.g. "Page", "Location")
  modelId: string; // e.g. "Page_DM"
  fields: EditableField[];
}

interface RawField {
  type: string;
  name: string;
  annotations?: { name: string; value: string }[];
  Field?: {
    fieldType?: { type?: string; StringType?: { lineBreaksPermitted?: boolean } };
    label?: { locale: string; text: string }[];
  };
}

function isDerived(f: RawField): boolean {
  const anns = f.annotations ?? [];
  if (anns.some((a) => a.name === "wiki12.derived")) return true; // slug / searchText
  if (f.name === "Slug") return true;
  return false;
}

function labelOf(f: RawField): string {
  const en = f.Field?.label?.find((l) => l.locale === "en")?.text;
  return en || f.Field?.label?.[0]?.text || f.name;
}

/** Parse a Document Model JSON (string or object) into editable field metadata. */
export function parseDocModel(dm: unknown): DocModelInfo {
  const json = typeof dm === "string" ? JSON.parse(dm) : (dm as Record<string, unknown>);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const j = json as any;
  const rootGroup = j?.content?.modelRoot?.rootGroups?.[0];
  const groupName: string = rootGroup?.name ?? "";
  const modelId: string = j?.header?.id ?? `${groupName}_DM`;
  const elements: RawField[] = rootGroup?.Group?.elements ?? [];
  const fields: EditableField[] = elements
    .filter((e) => e.type === "Field" && !isDerived(e))
    .map((f) => ({
      name: f.name,
      label: labelOf(f),
      multiline: f.Field?.fieldType?.StringType?.lineBreaksPermitted === true,
    }));
  return { groupName, modelId, fields };
}
