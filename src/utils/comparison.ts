import { normalizeSearch, type SearchParams } from "./search";

export const COMPARISON_LIMIT = 3;
export function parseCompareIds(value?: string | string[]) {
  if (value === undefined || value === "") return { ids: [], invalid: false };
  if (typeof value !== "string") return { ids: [], invalid: true };
  const raw = value.split(",");
  const unique = [...new Set(raw.filter((id) => /^[a-zA-Z0-9-]{1,64}$/.test(id)))];
  return { ids: unique.slice(0, COMPARISON_LIMIT), invalid: unique.length > COMPARISON_LIMIT || raw.some((id) => !unique.includes(id)) };
}
export function buildCompareHref(ids: string[], params: SearchParams = {}) {
  const query = new URLSearchParams();
  const valid = parseCompareIds(ids.join(",")).ids;
  if (valid.length) query.set("ids", valid.join(","));
  const { coordinates } = normalizeSearch(params);
  if (coordinates) { query.set("lat", String(coordinates.lat)); query.set("lon", String(coordinates.lon)); }
  return `/compare${query.size ? `?${query}` : ""}`;
}

type StorageAdapter = Pick<Storage, "getItem" | "setItem">;
type Selection = { ids: string[]; persistent: boolean };
const EMPTY: Selection = { ids: [], persistent: true };
const KEY = "oruri:comparison:v1";

// A per-provider store keeps SSR isolated; storage is first accessed after hydration.
export function createComparisonStore(validIds: string[], storage: () => StorageAdapter) {
  const allowed = new Set(validIds);
  const listeners = new Set<() => void>();
  let snapshot = EMPTY;
  let initialized = false;
  const emit = () => listeners.forEach((listener) => listener());
  const update = (ids: string[]) => {
    let persistent = snapshot.persistent;
    try { storage().setItem(KEY, JSON.stringify(ids)); } catch { persistent = false; }
    snapshot = { ids, persistent }; emit();
  };
  return {
    getSnapshot: () => snapshot,
    getServerSnapshot: () => EMPTY,
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (!initialized) {
        initialized = true;
        try {
          const raw = storage().getItem(KEY);
          let parsed: unknown = [];
          try { parsed = raw ? JSON.parse(raw) : []; } catch { /* Recover malformed saved data. */ }
          const ids = Array.isArray(parsed) ? [...new Set(parsed.filter((id): id is string => typeof id === "string" && allowed.has(id)))].slice(0, COMPARISON_LIMIT) : [];
          snapshot = { ids, persistent: true };
        } catch { snapshot = { ids: [], persistent: false }; }
        emit();
      }
      return () => { listeners.delete(listener); };
    },
    toggle(id: string) {
      if (!allowed.has(id)) return;
      if (snapshot.ids.includes(id)) update(snapshot.ids.filter((item) => item !== id));
      else if (snapshot.ids.length < COMPARISON_LIMIT) update([...snapshot.ids, id]);
    },
    remove(id: string) { update(snapshot.ids.filter((item) => item !== id)); },
    clear() { update([]); },
  };
}
