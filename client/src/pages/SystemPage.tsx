import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { listMigrations, saveMigrationScript, type Migration } from "../api/lifecycle";
import { getRuntimeConfig } from "../lib/runtimeConfig";
import { Banner } from "../components/Ui";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";
import { TextAreaStateless } from "@com.mgmtp.a12.widgets/widgets-core/lib/input";

export function SystemPage(): ReactElement {
  const { KEYCLOAK_CONSOLE_URL } = getRuntimeConfig();
  const [migrations, setMigrations] = useState<Migration[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listMigrations()
      .then(setMigrations)
      .catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  function open(m: Migration) {
    setOpenId(m.id);
    setDraft(m.script);
    setStatus(null);
  }

  async function save(id: string) {
    setSaving(true);
    setStatus(null);
    try {
      await saveMigrationScript(id, draft);
      setMigrations((prev) => prev.map((m) => (m.id === id ? { ...m, script: draft } : m)));
      setStatus("Saved. The lifecycle service transpiles + sandbox-runs the TS source.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2>System</h2>

      <section style={{ marginBottom: "2rem" }}>
        <h3>Users</h3>
        <p style={{ color: "#555" }}>Users are maintained in Keycloak.</p>
        <a href={KEYCLOAK_CONSOLE_URL} target="_blank" rel="noopener noreferrer">
          Open Keycloak admin console →
        </a>
      </section>

      <section>
        <h3>Migrations</h3>
        <p style={{ color: "#555", fontSize: "0.9rem" }}>
          Each migration is a <code>Migration</code> content item. Edit the TypeScript{" "}
          <code>script</code> source only — the model-lifecycle service transpiles and runs it in a
          sandbox; nothing is compiled in the browser.
        </p>

        {error && <Banner kind="error">{error}</Banner>}
        {migrations.length === 0 && !error && <p style={{ color: "#888" }}>No migrations.</p>}

        <ul style={{ listStyle: "none", padding: 0 }}>
          {migrations.map((m) => (
            <li key={m.id} style={{ borderBottom: "1px solid #eee", padding: "0.5rem 0" }}>
              <Button
                secondary
                onClick={() => (openId === m.id ? setOpenId(null) : open(m))}
                label={
                  <>
                    <strong>{m.targetModel}</strong> {String(m.fromVersion)} → {String(m.toVersion)}{" "}
                    <span style={{ color: "#999", fontFamily: "monospace" }}>({m.id})</span>
                  </>
                }
              />

              {openId === m.id && (
                <div style={{ marginTop: "0.5rem" }}>
                  <TextAreaStateless
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    wrapperStyle={{ width: "100%" }}
                    inputProps={{
                      spellCheck: false,
                      rows: 16,
                      style: { fontFamily: "monospace", fontSize: "0.85rem" },
                    }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.4rem" }}>
                    <Button
                      label={saving ? "Saving…" : "Save TS source"}
                      primary
                      onClick={() => save(m.id)}
                      disabled={saving}
                    />
                    {status && <span style={{ fontSize: "0.85rem", color: "#555" }}>{status}</span>}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
