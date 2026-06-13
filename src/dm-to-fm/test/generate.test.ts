// Tests for the DM → default FM generator. Node's built-in test runner, run via
//   node --test --experimental-strip-types test/*.test.ts
// (no extra deps). Uses the canonical document models under models/document-models/.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { generateFormModel, unresolvedRefs } from "../src/generate.ts";
import type { DMElement, DocumentModel } from "../src/types.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, "..", "..", "..");
const DM_DIR = join(REPO, "models", "document-models");

function loadDM(name: string): DocumentModel {
  return JSON.parse(readFileSync(join(DM_DIR, name), "utf8")) as DocumentModel;
}

// Count DM groups (depth-first) that have at least one non-excluded field, and
// the field ids the form is expected to bind (excluding searchText).
function dmFieldIds(dm: DocumentModel): string[] {
  const ids: string[] = [];
  function visit(el: DMElement): void {
    if (el.type === "Field") {
      const anns = (el.annotations as { name: string; value: string }[] | undefined) ?? [];
      const isSearchText = anns.some((a) => a.name === "wiki12.derived" && a.value === "searchText");
      if (!isSearchText) ids.push(el.id);
    }
    const detail = el[el.type] as { elements?: DMElement[] } | undefined;
    for (const child of detail?.elements ?? []) visit(child);
  }
  for (const rg of dm.content.modelRoot.rootGroups) visit(rg);
  return ids;
}

function controlRefs(fm: ReturnType<typeof generateFormModel>): string[] {
  const refs: string[] = [];
  for (const screen of fm.content.screens)
    for (const section of screen.screenElements)
      for (const grid of section.screenElements)
        for (const row of grid.row)
          for (const cell of row.cell) refs.push(cell.elementRef);
  return refs;
}

const ALL = ["Page_DM.json", "Person_DM.json", "Film_DM.json", "Location_DM.json"];

test("a section per DM group", () => {
  // Each canonical DM has exactly one root group, so exactly one section.
  for (const name of ALL) {
    const dm = loadDM(name);
    const fm = generateFormModel(dm);
    const groupCount = dm.content.modelRoot.rootGroups.filter((g) => g.type === "Group").length;
    const sections = fm.content.screens[0].screenElements;
    assert.equal(sections.length, groupCount, `${name}: section count`);
    assert.equal(sections.length, 1, `${name}: one root group → one section`);
  }
});

test("one control per (non-searchText) field", () => {
  for (const name of ALL) {
    const dm = loadDM(name);
    const fm = generateFormModel(dm);
    const expected = dmFieldIds(dm);
    const refs = controlRefs(fm);
    assert.equal(refs.length, expected.length, `${name}: control count`);
    assert.deepEqual(new Set(refs), new Set(expected), `${name}: control refs match fields`);
  }
});

test("the wiki12.derived=searchText field is excluded", () => {
  for (const name of ALL) {
    const dm = loadDM(name);
    const fm = generateFormModel(dm);
    // find the searchText field id in the DM
    let searchTextId: string | undefined;
    function visit(el: DMElement): void {
      if (el.type === "Field") {
        const anns = (el.annotations as { name: string; value: string }[] | undefined) ?? [];
        if (anns.some((a) => a.name === "wiki12.derived" && a.value === "searchText")) searchTextId = el.id;
      }
      const detail = el[el.type] as { elements?: DMElement[] } | undefined;
      for (const child of detail?.elements ?? []) visit(child);
    }
    for (const rg of dm.content.modelRoot.rootGroups) visit(rg);
    assert.ok(searchTextId, `${name}: DM has a searchText field`);
    assert.ok(!controlRefs(fm).includes(searchTextId!), `${name}: searchText excluded from form`);
  }
});

test("every generated Control.elementRef resolves (unresolvedRefs empty)", () => {
  for (const name of ALL) {
    const dm = loadDM(name);
    const fm = generateFormModel(dm);
    assert.deepEqual(unresolvedRefs(dm, fm), [], `${name}: no unresolved refs`);
  }
});

test("FM header references the DM id", () => {
  for (const name of ALL) {
    const dm = loadDM(name);
    const fm = generateFormModel(dm);
    assert.equal(fm.header.modelType, "form", `${name}: modelType=form`);
    assert.equal(fm.header.id, dm.header.id.replace(/_DM$/, "_FM"), `${name}: FM id`);
    const ref = fm.header.modelReferences[0];
    assert.equal(ref.reference, dm.header.id, `${name}: modelReferences points at DM id`);
    assert.equal(ref.purpose, "data binding", `${name}: data-binding reference`);
  }
});
