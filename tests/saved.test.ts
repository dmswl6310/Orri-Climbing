import { expect, it, vi } from "vitest";
import { createSavedStore, SAVED_KEY } from "@/utils/saved";

const disk = (initial: string | null = null) => {
  let value = initial;
  return { getItem: () => value, setItem: (_key: string, next: string) => { value = next; } };
};
it("restores valid unique IDs and persists saves and removals", () => {
  const storage = disk('["1","missing","1",2]');
  const store = createSavedStore(["1", "2"], () => storage);
  store.subscribe(() => {});
  expect(store.getSnapshot().ids).toEqual(["1"]);
  store.toggle("2"); store.toggle("1");
  const restored = createSavedStore(["1", "2"], () => storage);
  restored.subscribe(() => {});
  expect(restored.getSnapshot().ids).toEqual(["2"]);
});
it("recovers malformed data and rejects unknown IDs", () => {
  const store = createSavedStore(["1"], () => disk("broken"));
  store.subscribe(() => {}); store.toggle("missing");
  expect(store.getSnapshot().ids).toEqual([]);
});
it("does not claim success when a storage write fails, and supports retry", () => {
  const storage = disk('["1"]');
  const write = vi.spyOn(storage, "setItem").mockImplementationOnce(() => { throw new Error("quota"); });
  const store = createSavedStore(["1", "2"], () => storage);
  store.subscribe(() => {}); store.toggle("2");
  expect(store.getSnapshot().ids).toEqual(["1"]);
  expect(store.getSnapshot().error).toBeTruthy();
  store.toggle("2");
  expect(store.getSnapshot().ids).toEqual(["2", "1"]);
  expect(store.getSnapshot().error).toBe("");
  expect(write).toHaveBeenCalledTimes(2);
});
it("handles blocked reads without crashing", () => {
  const store = createSavedStore(["1"], () => { throw new Error("blocked"); });
  store.subscribe(() => {}); store.toggle("1");
  expect(store.getSnapshot()).toMatchObject({ ids: [], ready: true });
  expect(store.getSnapshot().error).toBeTruthy();
});
it("syncs external changes and merges the latest disk state before writing", () => {
  const storage = disk();
  const store = createSavedStore(["1", "2"], () => storage);
  store.subscribe(() => {});
  storage.setItem(SAVED_KEY, '["2"]');
  store.toggle("1");
  expect(store.getSnapshot().ids).toEqual(["1", "2"]);
  storage.setItem(SAVED_KEY, "[]"); store.refresh();
  expect(store.getSnapshot().ids).toEqual([]);
});
