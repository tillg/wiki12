import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { loadDocumentModel } from "../api/models";
import {
  createDocument,
  deleteDocument,
  readByRef,
  updateDocument,
  type ContentItem,
  type SlugChange,
} from "../api/content";
import { parseDocModel, type DocModelInfo } from "../lib/docModel.ts";
import { SimpleForm, type SimpleFormHandle } from "../components/SimpleForm";
import { Banner, ConfirmDialog } from "../components/Ui";

// /edit/:ref  -> edit existing (ref = id-or-slug)
// /create?type=Page -> create new of the given type
export function EditPage(): ReactElement {
  const { ref } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isCreate = ref === undefined;
  const [type, setType] = useState<string>(searchParams.get("type") ?? "Page");
  const [existing, setExisting] = useState<ContentItem | null>(null);
  const [docModel, setDocModel] = useState<DocModelInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [slugChange, setSlugChange] = useState<SlugChange | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const handleRef = useRef<SimpleFormHandle | null>(null);

  // Load the existing item (edit) then its models; or just models (create).
  useEffect(() => {
    let active = true;
    setError(null);
    (async () => {
      try {
        let resolvedType = type;
        let item: ContentItem | null = null;
        if (!isCreate && ref) {
          item = await readByRef(decodeURIComponent(ref));
          resolvedType = item.type;
          if (active) {
            setExisting(item);
            setType(item.type);
          }
        }
        const dmString = await loadDocumentModel(resolvedType);
        if (active) setDocModel(parseDocModel(dmString));
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  async function save() {
    if (!handleRef.current) return;
    setSaving(true);
    setError(null);
    setSlugChange(null);
    try {
      const document = handleRef.current.getDocument();
      const result =
        isCreate || !existing
          ? await createDocument(type, document)
          : await updateDocument(existing.type, existing.id, document, existing.slug);

      if (result.slugChange) setSlugChange(result.slugChange);
      // Navigate to the saved item's view (by new slug, fallback id).
      navigate(`/view/${encodeURIComponent(result.item.slug || result.item.id)}`, {
        state: { slugChange: result.slugChange },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    if (!existing) return;
    setConfirmDelete(false);
    try {
      await deleteDocument(existing.type, existing.id);
      navigate("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  const currentSlug = existing?.slug ?? "(assigned on save)";

  return (
    <div>
      <h2>{isCreate ? `New ${type}` : `Edit ${existing?.type ?? type}`}</h2>

      {error && <Banner kind="error">{error}</Banner>}
      {slugChange && (
        <Banner kind="info">
          Slug changed: <code>{slugChange.old}</code> → <code>{slugChange.new}</code>. The old slug
          no longer resolves.
        </Banner>
      )}

      {/* Slug is read-only and system-derived (ADR-0001). */}
      <div style={{ margin: "0.5rem 0 1rem", fontSize: "0.9rem" }}>
        <label style={{ color: "#666", marginRight: "0.5rem" }}>Slug (read-only):</label>
        <code style={{ background: "#f3f3f3", padding: "0.15rem 0.4rem", borderRadius: 3 }}>
          {currentSlug}
        </code>
      </div>

      {!docModel && !error && <p>Loading form…</p>}
      {docModel && (
        <SimpleForm
          model={docModel}
          initialDocument={existing?.document}
          onReady={(h) => {
            handleRef.current = h;
          }}
        />
      )}

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <button onClick={save} disabled={saving || !docModel}>
          {saving ? "Saving…" : "Save"}
        </button>
        {!isCreate && existing && (
          <button onClick={() => setConfirmDelete(true)} style={{ color: "#b00" }}>
            Delete
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this item?"
        message={
          <>
            Delete <code>{existing?.slug}</code>? This cannot be undone.
          </>
        }
        confirmLabel="Delete"
        onConfirm={doDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
