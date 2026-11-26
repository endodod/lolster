const get = <T,>(k: string, d: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v == null ? d : (JSON.parse(v) as T);
  } catch {
    return d;
  }
};
const set = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* private mode */
  }
};

export const store = { get, set };

/** Stable per-browser id so a refresh rejoins the same seat in a lobby. */
export function playerId(): string {
  let id = get<string | null>("lolster.pid", null);
  if (!id) {
    id = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36)).replace(/-/g, "");
    set("lolster.pid", id);
  }
  return id;
}

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
export const newCode = () => Array.from({ length: 4 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
export const cleanCode = (s: string) => s.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4);
