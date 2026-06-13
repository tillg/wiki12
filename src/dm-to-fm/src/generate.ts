// DM → default FM generator — the headless equivalent of the SME's
// "Build Screens From Fields". Produces a default Form Model from a Document
// Model: one screen, a section per group, one control per field.
//
// Format reverse-engineered from real models in
// docs/a12/sample-models/reference/ (Contact_FM, ProjectTemplate_Person_FM).

import type {
  Annotation, Control, ControlGrid, DMElement, DocumentModel,
  FormModel, LabelText, Multilingual, Row, Section,
} from "./types.ts";

// Form models carry their own model-format version (distinct from DM's 28.4.0).
const FORM_MODEL_VERSION = "37.4.0";

function ml(en: string, de?: string): Multilingual {
  return {
    type: "Multilingual",
    multilingualText: { text: [{ locale: "en", text: en }, { locale: "de", text: de ?? en }] },
  };
}

// "PersonalData" / "ReleaseYear" → "Personal Data" / "Release Year"
function humanize(name: string): string {
  return name
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function annotationValue(anns: Annotation[], name: string): string | undefined {
  return anns.find((a) => a.name === name)?.value;
}

interface GroupWithFields { group: DMElement; fields: DMElement[]; }

// Depth-first walk of the DM; collect each group together with its DIRECT fields.
function collectGroups(rootGroups: DMElement[], exclude: Set<string>): GroupWithFields[] {
  const out: GroupWithFields[] = [];
  function visit(el: DMElement): void {
    if (el.type !== "Group") return;
    const detail = el.Group as { elements?: DMElement[] } | undefined;
    const elements = detail?.elements ?? [];
    const fields = elements.filter((c) => c.type === "Field" && !exclude.has(c.name));
    if (fields.length > 0) out.push({ group: el, fields });
    for (const child of elements) if (child.type === "Group") visit(child);
  }
  for (const rg of rootGroups) visit(rg);
  return out;
}

function sectionFor({ group, fields }: GroupWithFields): Section {
  const rows: Row[] = fields.map((f, i) => ({
    type: "Row",
    id: `row-${group.id}-${i + 1}`,
    name: `r${i + 1}`,
    cell: [{ type: "Control", id: `control-${f.id}`, elementRef: f.id } satisfies Control],
  }));
  const grid: ControlGrid = {
    type: "ControlGrid",
    id: `controlgrid-${group.id}`,
    name: "CG1",
    layout: { lg: "12" }, // single column; one control per row
    row: rows,
  };
  return {
    type: "MultiColumnSection",
    id: `section-${group.id}`,
    name: group.name,
    title: ml(humanize(group.name)),
    layout: { lg: "12" },
    screenElements: [grid],
  };
}

function footerBox() {
  return {
    id: "footerBox1",
    minorButtons: {
      button: [{
        type: "EVENT", id: "button-cancel", name: "Cancel",
        buttonStyling: { label: ml("Cancel", "Abbrechen"), priority: "SECONDARY", destructive: true },
        event: "event_cancel", scope: "HIDDEN_IN_READONLY_MODE",
      }],
    },
    majorButtons: {
      button: [{
        type: "EVENT", id: "button-save", name: "Save",
        buttonStyling: { label: ml("Save", "Speichern"), priority: "PRIMARY" },
        event: "event_save", validation: "full", scope: "HIDDEN_IN_READONLY_MODE",
      }],
    },
  };
}

export interface GenerateOptions {
  /** Field names to omit, in addition to fields annotated wiki12.derived="searchText". */
  exclude?: string[];
}

/** Names of fields carrying a given field-level annotation name=value. */
function fieldsByAnnotation(dm: DocumentModel, name: string, value: string): string[] {
  const out: string[] = [];
  function visit(el: DMElement): void {
    if (el.type === "Field") {
      const anns = (el.annotations as Annotation[] | undefined) ?? [];
      if (anns.some((a) => a.name === name && a.value === value)) out.push(el.name);
    }
    const detail = el[el.type] as { elements?: DMElement[] } | undefined;
    for (const child of detail?.elements ?? []) visit(child);
  }
  for (const rg of dm.content.modelRoot.rootGroups) visit(rg);
  return out;
}

export function generateFormModel(dm: DocumentModel, opts: GenerateOptions = {}): FormModel {
  const dmId = dm.header.id;
  const fmId = dmId.replace(/_DM$/, "_FM");
  const anns = dm.header.annotations ?? [];

  // Exclude the internal search blob by default — the field annotated
  // wiki12.derived=searchText (a generated index field, not for editing).
  const searchFields = fieldsByAnnotation(dm, "wiki12.derived", "searchText");
  const exclude = new Set<string>([...(opts.exclude ?? []), ...searchFields]);

  const rootGroups = dm.content.modelRoot.rootGroups;
  const groups = collectGroups(rootGroups, exclude);
  const sections = groups.map(sectionFor);

  const roles = annotationValue(anns, "roles") ?? "user";
  const titleSource = rootGroups[0]?.name ?? fmId;
  const labels: LabelText[] = [
    { locale: "en", text: humanize(titleSource) },
    { locale: "de", text: humanize(titleSource) },
  ];

  return {
    header: {
      id: fmId,
      modelType: "form",
      modelVersion: FORM_MODEL_VERSION,
      locales: dm.header.locales,
      labels,
      annotations: [{ name: "roles", value: roles }],
      modelReferences: [{ alias: dmId, modelType: "document", purpose: "data binding", reference: dmId }],
    },
    content: {
      // subHeaderBox is REQUIRED by the form engine's FormModel.Content.isInstance
      // check (formengine-core unmarshallFormModel) — omitting it makes the engine
      // reject the model with "Json is no valid FormModel!" (QA-LOG B10). Minimal
      // empty box satisfies it.
      subHeaderBox: { id: "subHeaderBox1", majorButtons: { button: [] }, minorButtons: { button: [] } },
      footerBox: footerBox(),
      screens: [{ id: "screen1", name: "Screen1", screenElements: sections }],
      fieldConfiguration: { field: [] },
      groupConfiguration: {},
      defaults: {
        buttonLabels: {
          ADD: { text: [{ locale: "en", text: "Add" }, { locale: "de", text: "Hinzufügen" }] },
          CANCEL: { text: [{ locale: "en", text: "Cancel" }, { locale: "de", text: "Abbrechen" }] },
        },
      },
    },
  };
}

/** Every Control.elementRef must resolve to a Field id in the DM. Returns unresolved refs. */
export function unresolvedRefs(dm: DocumentModel, fm: FormModel): string[] {
  const fieldIds = new Set<string>();
  function visit(el: DMElement): void {
    if (el.type === "Field") fieldIds.add(el.id);
    const detail = el[el.type] as { elements?: DMElement[] } | undefined;
    for (const child of detail?.elements ?? []) visit(child);
  }
  for (const rg of dm.content.modelRoot.rootGroups) visit(rg);

  const bad: string[] = [];
  for (const screen of fm.content.screens)
    for (const section of screen.screenElements)
      for (const grid of section.screenElements)
        for (const row of grid.row)
          for (const cell of row.cell)
            if (!fieldIds.has(cell.elementRef)) bad.push(cell.elementRef);
  return bad;
}
