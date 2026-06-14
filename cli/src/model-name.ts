// Model-name mapping: a content type maps to its A12 data-model name by
// capitalizing the type and appending "_DM" (page -> Page_DM, person ->
// Person_DM, etc.). Per the integration contract.

export function modelName(type: string): string {
  if (!type) throw new Error("type is required");
  return `${rootGroup(type)}_DM`;
}

// The root field-group of a content document = the capitalized type name
// (page -> "Page", person -> "Person"). The A12 Data Service expects a document
// as a group-keyed object { <Group>: { ...fields } } (see client toServerDocument
// + the /<Group>/Field model paths the server uses), so the CLI wraps the flat
// --field pairs under this group before ADD_DOCUMENT / MODIFY_DOCUMENT.
// VERIFY: group == capitalized type holds for every sample DM (Page/Person/Film/
// Location); a DM whose root group differs from its type would need its group read
// from the model.
export function rootGroup(type: string): string {
  if (!type) throw new Error("type is required");
  return `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
}
