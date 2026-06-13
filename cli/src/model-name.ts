// Model-name mapping: a content type maps to its A12 data-model name by
// capitalizing the type and appending "_DM" (page -> Page_DM, person ->
// Person_DM, etc.). Per the integration contract.

export function modelName(type: string): string {
  if (!type) throw new Error("type is required");
  return `${type.charAt(0).toUpperCase()}${type.slice(1)}_DM`;
}
