// Model-driven simple form for create/edit (QA-LOG / FORM-ENGINE-DECISIONS).
//
// Renders one input per editable Data-Model field (multiline String -> textarea
// for the markdown body), bound to plain React state. Reliable load + read-back
// against the real Data Service, independent of the A12 form-engine value binding
// (which we couldn't get to two-way bind with our hand-generated form models).

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";

import type { DocModelInfo } from "../lib/docModel.ts";
import type { ContentDocument } from "../api/content";

export interface SimpleFormHandle {
  /** Build the server document payload: { <Group>: { field: value, … } }. */
  getDocument(): ContentDocument;
}

export interface SimpleFormProps {
  model: DocModelInfo;
  /** Existing server document for edit: { <Group>: {…}, __meta }. Omit for create. */
  initialDocument?: ContentDocument;
  onReady?: (handle: SimpleFormHandle) => void;
}

export function SimpleForm(props: SimpleFormProps): ReactElement {
  const { model } = props;

  const initialValues = useMemo(() => {
    const group = (props.initialDocument?.[model.groupName] as Record<string, unknown>) ?? {};
    const v: Record<string, string> = {};
    for (const f of model.fields) v[f.name] = group[f.name] != null ? String(group[f.name]) : "";
    return v;
  }, [props.initialDocument, model]);

  const [values, setValues] = useState<Record<string, string>>(initialValues);

  // Ref mirrors the latest values so the read-back handle never reads stale state.
  const valuesRef = useRef(values);
  valuesRef.current = values;

  useEffect(() => {
    props.onReady?.({
      getDocument(): ContentDocument {
        const group: Record<string, unknown> = {};
        for (const f of model.fields) {
          const val = valuesRef.current[f.name] ?? "";
          if (val !== "") group[f.name] = val;
        }
        return { [model.groupName]: group };
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);

  return (
    <div style={{ display: "grid", gap: "0.9rem", maxWidth: "40rem" }}>
      {model.fields.map((f) => (
        <label key={f.name} style={{ display: "grid", gap: "0.25rem" }}>
          <span style={{ fontSize: "0.85rem", color: "#555" }}>{f.label}</span>
          {f.multiline ? (
            <textarea
              value={values[f.name] ?? ""}
              onChange={(e) => setValues((s) => ({ ...s, [f.name]: e.target.value }))}
              rows={10}
              style={{ font: "inherit", padding: "0.5rem", border: "1px solid #ccc", borderRadius: 4 }}
            />
          ) : (
            <input
              value={values[f.name] ?? ""}
              onChange={(e) => setValues((s) => ({ ...s, [f.name]: e.target.value }))}
              style={{ font: "inherit", padding: "0.5rem", border: "1px solid #ccc", borderRadius: 4 }}
            />
          )}
        </label>
      ))}
    </div>
  );
}
