import { describe, expect, it } from "vitest";
import { MOCK_GYMS } from "@/constants/gyms";
import { filterGyms, getGyms } from "@/services/gymService";
import { buildSearchHref, normalizeSearch } from "@/utils/search";
import { getDailyPrice, getFacilityStatus } from "@/utils/gymFacts";
import type { GymDetail } from "@/types/gyms/types";

const fixtures: GymDetail[] = [
  { ...MOCK_GYMS[0], id: "free", prices: [{ kind: "day-pass", label: "일일 이용권", amount: 0 }], beginnerLesson: true, amenities: { parking: true, shower: true, rental: false } },
  { ...MOCK_GYMS[1], id: "paid", prices: [{ kind: "day-pass", label: "일일 이용권", amount: 20000 }], beginnerLesson: false, amenities: { parking: true, shower: false, rental: true } },
  { ...MOCK_GYMS[2], id: "unknown", prices: undefined, beginnerLesson: undefined, amenities: undefined, facilities: [] },
];

describe("choice filters", () => {
  it("applies a real facility filter to the service results", async () => {
    const result = await getGyms({ parking: "1", shower: "1" });
    expect(result.gyms.length).toBeGreaterThan(0);
    expect(result.gyms.some((gym) => gym.id === "2")).toBe(false);
  });
  it("includes the exact budget boundary and excludes unregistered prices", () => {
    expect(filterGyms(fixtures, { maxPrice: "20000" }).map((gym) => gym.id)).toEqual(["free", "paid"]);
    expect(filterGyms(fixtures, { maxPrice: "0" }).map((gym) => gym.id)).toEqual(["free"]);
    expect(filterGyms(fixtures, { maxPrice: "19999" }).map((gym) => gym.id)).toEqual(["free"]);
  });
  it("ANDs facilities and requires explicitly available beginner lessons", () => {
    expect(filterGyms(fixtures, { parking: "1", shower: "1", beginner: "1" }).map((gym) => gym.id)).toEqual(["free"]);
    expect(filterGyms(fixtures, { shower: "1", rental: "1" })).toEqual([]);
    expect(filterGyms(fixtures, { beginner: "1" }).map((gym) => gym.id)).toEqual(["free"]);
  });
  it("distinguishes unavailable from unknown and does not treat lessons as day passes", () => {
    expect(getFacilityStatus(fixtures[0], "rental")).toBe(false);
    expect(getFacilityStatus(fixtures[2], "parking")).toBeUndefined();
    expect(getFacilityStatus({ ...fixtures[2], facilities: ["무료주차"] }, "parking")).toBe(true);
    expect(getDailyPrice({ ...fixtures[0], prices: [{ kind: "other", label: "체험", amount: 5000 }] })).toBeUndefined();
  });
  it("keeps zero results separate from recommendations", async () => {
    const result = await getGyms({ q: "존재하지않는암장", parking: "1" });
    expect(result.gyms).toEqual([]);
    expect(result.recommendations).toHaveLength(6);
  });
});

describe("filter URL contract", () => {
  it.each(["-1", "NaN", "Infinity", "1.5", "1000001", "1e3", ["1", "2"]])("ignores invalid budgets %j", (maxPrice) => {
    const search = normalizeSearch({ maxPrice, parking: "yes", beginner: ["1", "1"] });
    expect(search.filters).toEqual({ maxPrice: undefined, parking: false, shower: false, rental: false, beginner: false });
    expect(search.invalidFilters).toBe(true);
  });
  it("preserves filters and location when only the sort or keyword changes", () => {
    const params = { q: "강남", maxPrice: "20000", parking: "1", lat: "37", lon: "127", sort: "distance" };
    const href = buildSearchHref(params, { sort: "popular", q: "서초" });
    const query = new URL(href, "https://example.test").searchParams;
    expect(Object.fromEntries(query)).toEqual({ q: "서초", maxPrice: "20000", parking: "1", lat: "37", lon: "127", sort: "popular" });
  });
});
