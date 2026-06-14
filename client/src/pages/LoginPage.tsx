import { useState } from "react";
import type { FormEvent, ReactElement } from "react";

import { login } from "../lib/auth.ts";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";
import { TextField } from "@com.mgmtp.a12.widgets/widgets-core/lib/input";

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
          <div style={inputWrapStyle}>
            <TextField
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              inputProps={{ autoComplete: "username", autoFocus: true }}
            />
          </div>
        </label>

        <label style={{ display: "block", fontSize: "0.8rem", color: "#555", marginTop: "0.75rem" }}>
          Password
          <div style={inputWrapStyle}>
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{ type: "password", autoComplete: "current-password" }}
            />
          </div>
        </label>

        {error && (
          <div style={{ marginTop: "0.75rem", color: "#b00020", fontSize: "0.85rem" }}>{error}</div>
        )}

        <div style={{ marginTop: "1.25rem" }}>
          <Button label={busy ? "Signing in…" : "Sign in"} primary type="submit" disabled={busy} block />
        </div>
        <p style={{ margin: "0.9rem 0 0", color: "#999", fontSize: "0.75rem" }}>
          Default dev user: <code>admin</code> / <code>admin</code>
        </p>
      </form>
    </div>
  );
}

const inputWrapStyle: React.CSSProperties = {
  width: "100%",
  marginTop: "0.25rem",
};
