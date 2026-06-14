// Pure helper (no A12 imports, so it's unit-testable in the node test env):
// turn an activity `instance` docRef ("Model_DM/<uuid>") into the (type, id) pair
// api/content.ts expects — it rebuilds the docRef from type + id internally.
export function splitDocRef(instance: string): { model: string; id: string } {
  const slash = instance.indexOf("/");
  return slash < 0
    ? { model: instance, id: "" }
    : { model: instance.slice(0, slash), id: instance.slice(slash + 1) };
}
