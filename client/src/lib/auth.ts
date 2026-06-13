// Authentication against the A12 Data Service (LOCAL auth).
//
// The user logs in with username/password; UAA returns a `UAABearer` JWT in the
// `access_token` response header, which we cache (and persist in localStorage so a
// reload stays logged in until the token expires). The API layer attaches it; on a
// 401 we log out, which sends the user back to the login screen.

const LOGIN_URL = "/api/user/local/login";
const STORAGE_KEY = "wiki12.token";
const USER_KEY = "wiki12.user";

let token = "";
let currentUser = "";
try {
  token = localStorage.getItem(STORAGE_KEY) || "";
  currentUser = localStorage.getItem(USER_KEY) || "";
} catch {
  /* localStorage unavailable — in-memory only */
}

const listeners = new Set<() => void>();
function notify(): void {
  for (const l of listeners) l();
}

/** Subscribe to auth state changes (login/logout). Returns an unsubscribe fn. */
export function onAuthChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToken(): string {
  return token;
}
export function isAuthenticated(): boolean {
  return !!token;
}
export function getUser(): string {
  return currentUser;
}

/** Log in; throws with a friendly message on bad credentials / transport error. */
export async function login(username: string, password: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept-Language": "en" },
      body: JSON.stringify({ username, password }),
    });
  } catch (e) {
    throw new Error(`Cannot reach the server: ${e instanceof Error ? e.message : String(e)}`);
  }
  if (res.status === 401 || res.status === 403) {
    throw new Error("Invalid username or password.");
  }
  if (!res.ok) {
    throw new Error(`Login failed: HTTP ${res.status} ${res.statusText}`);
  }
  const t = res.headers.get("access_token") || "";
  if (!t) throw new Error("Login succeeded but the server returned no token.");
  token = t;
  currentUser = username;
  try {
    localStorage.setItem(STORAGE_KEY, token);
    localStorage.setItem(USER_KEY, username);
  } catch {
    /* ignore */
  }
  notify();
}

/** Clear the session (also called automatically on a 401). */
export function logout(): void {
  token = "";
  currentUser = "";
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
  notify();
}
