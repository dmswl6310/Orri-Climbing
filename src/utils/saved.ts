export const SAVED_KEY = "oruri:saved:v1";
type Snapshot = { ids: string[]; ready: boolean; error: string };
const INITIAL: Snapshot = { ids: [], ready: false, error: "" };
type SavedStorage = Pick<Storage, "getItem" | "setItem">;

// IDs only; no account, coordinates or gym details are stored on the device.
export function createSavedStore(validIds: string[], storage: () => SavedStorage) {
  const allowed = new Set(validIds);
  const listeners = new Set<() => void>();
  let snapshot = INITIAL;
  const emit = (next: Snapshot) => { snapshot = next; listeners.forEach((listener) => listener()); };
  function read() {
    const raw = storage().getItem(SAVED_KEY);
    let data: unknown;
    try { data = raw ? JSON.parse(raw) : []; } catch { data = []; }
    return Array.isArray(data) ? [...new Set(data.filter((id): id is string => typeof id === "string" && allowed.has(id)))] : [];
  }
  function refresh() {
    try { emit({ ids: read(), ready: true, error: "" }); }
    catch { emit({ ...snapshot, ready: true, error: "이 브라우저의 저장소를 읽을 수 없습니다. 브라우저 설정을 확인한 뒤 다시 시도해주세요." }); }
  }
  return {
    getSnapshot: () => snapshot,
    getServerSnapshot: () => INITIAL,
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (!snapshot.ready) refresh();
      return () => { listeners.delete(listener); };
    },
    refresh,
    toggle(id: string) {
      if (!allowed.has(id)) return;
      try {
        // Read again so a sequential edit in another tab is not overwritten.
        const current = read();
        const ids = current.includes(id) ? current.filter((item) => item !== id) : [id, ...current];
        storage().setItem(SAVED_KEY, JSON.stringify(ids));
        emit({ ids, ready: true, error: "" });
      } catch {
        emit({ ...snapshot, ready: true, error: "변경 내용을 저장하지 못했습니다. 기존 목록을 유지합니다. 브라우저 설정이나 저장 공간을 확인하고 다시 눌러주세요." });
      }
    },
  };
}
