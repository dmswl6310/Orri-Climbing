import { describe, expect, it } from "vitest";
import { buildCompareHref, parseCompareIds, createComparisonStore } from "@/utils/comparison";

describe("comparison URL", () => {
  it("deduplicates, caps and reports malformed candidates", () => {
    expect(parseCompareIds("1,1,2,3,4")).toEqual({ ids: ["1", "2", "3"], invalid: true });
    expect(parseCompareIds(["1", "2"])).toEqual({ ids: [], invalid: true });
    expect(parseCompareIds("demo-1,../../bad,2")).toEqual({ ids: ["demo-1", "2"], invalid: true });
  });
  it("preserves order and only shares valid optional coordinates", () => {
    expect(buildCompareHref(["demo-2", "1"], { lat: "37", lon: "127" })).toBe("/compare?ids=demo-2%2C1&lat=37&lon=127");
    expect(buildCompareHref(["1", "2"], { lat: "91", lon: "127" })).toBe("/compare?ids=1%2C2");
  });
});

describe("comparison selection", () => {
  const storage = (initial: string | null = null) => {
    let value = initial;
    return { getItem: () => value, setItem: (_key: string, next: string) => { value = next; } };
  };
  it("restores valid unique IDs and persists removals across reloads", () => {
    const disk = storage(JSON.stringify(["1", "missing", "1", "2"]));
    const store = createComparisonStore(["1", "2", "3", "4"], () => disk);
    store.subscribe(() => {});
    expect(store.getSnapshot().ids).toEqual(["1", "2"]);
    store.toggle("3"); store.toggle("4");
    expect(store.getSnapshot().ids).toEqual(["1", "2", "3"]);
    store.toggle("2");
    const reloaded = createComparisonStore(["1", "2", "3", "4"], () => disk);
    reloaded.subscribe(() => {});
    expect(reloaded.getSnapshot().ids).toEqual(["1", "3"]);
    reloaded.clear();
    expect(reloaded.getSnapshot().ids).toEqual([]);
  });
  it("continues in memory when storage is blocked", () => {
    const store = createComparisonStore(["1", "2"], () => { throw new Error("blocked"); });
    store.subscribe(() => {});
    store.toggle("1"); store.toggle("2");
    expect(store.getSnapshot()).toEqual({ ids: ["1", "2"], persistent: false });
  });
  it("ignores corrupt storage and unrecognised IDs", () => {
    const store = createComparisonStore(["1"], () => storage("not-json"));
    store.subscribe(() => {});
    store.toggle("missing");
    expect(store.getSnapshot().ids).toEqual([]);
    store.toggle("1");
    expect(store.getSnapshot().ids).toEqual(["1"]);
  });
});
