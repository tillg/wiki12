import { useState } from "react";
import type { FormEvent, ReactElement } from "react";

import { login } from "../lib/auth.ts";

/** Login screen shown when there is no active session. On success, auth state
 * changes and App swaps in the application shell. */
export function LoginPage(): ReactElement {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(username.trim(), password);
      // onAuthChange in App re-renders to the app shell — nothing else to do.
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f4f6f8" }}>
      <form
        onSubmit={onSubmit}
        style={{
          width: "20rem",
          padding: "2rem",
          background: "#fff",
          border: "1px solid #e2e6ea",
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <h1 style={{ margin: "0 0 0.25rem", fontSize: "1.6rem" }}>wiki12</h1>
        <p style={{ margin: "0 0 1.25rem", color: "#777", fontSize: "0.9rem" }}>Sign in to continue</p>

        <label style={{ display: "block", fontSize: "0.8rem", color: "#555" }}>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            style={inputStyle}
          />
        </label>

        <label style={{ display: "block", fontSize: "0.8rem", color: "#555", marginTop: "0.75rem" }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={inputStyle}
          />
        </label>

        {error && (
          <div style={{ marginTop: "0.75rem", color: "#b00020", fontSize: "0.85rem" }}>{error}</div>
        )}

        <button type="submit" disabled={busy} style={buttonStyle}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p style={{ margin: "0.9rem 0 0", color: "#999", fontSize: "0.75rem" }}>
          Default dev user: <code>admin</code> / <code>admin</code>
        </p>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  marginTop: "0.25rem",
  padding: "0.5rem 0.6rem",
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: "0.95rem",
  boxSizing: "border-box",
};

const buttonStyle: React.CSSProperties = {
  marginTop: "1.25rem",
  width: "100%",
  padding: "0.6rem",
  background: "#2f6fed",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  fontSize: "0.95rem",
  cursor: "pointer",
};
