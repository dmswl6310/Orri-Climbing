import { describe, expect, it } from "vitest";
import { getGyms } from "@/services/gymService";
import { getDistance } from "@/utils.math";
import { normalizeSearch } from "@/utils/search";

it("ignores repeated URL parameters and invalid coordinates consistently", () => {
  expect(normalizeSearch({ q: ["강남", "서초"], lat: ["37", "38"], lon: "127", sort: ["popular", "distance"] })).toEqual({
    q: "", coordinates: null, sort: "popular", invalidCoordinates: true,
  });
  expect(normalizeSearch({ lat: "0", lon: "0" })).toMatchObject({
    coordinates: { lat: 0, lon: 0 }, sort: "distance", invalidCoordinates: false,
  });
});

describe("search ordering", () => {
  it("orders the default results by saved count", async () => {
    const { gyms } = await getGyms({});
    expect(gyms.slice(0, 3).map((gym) => gym.id)).toEqual(["21", "1", "31"]);
  });

  it.each([
    { sort: "newest" },
    { sort: "invalid" },
    { sort: "distance", lat: "oops", lon: "127" },
    { sort: "distance", lat: "91", lon: "127" },
    { sort: "distance", lat: "37", lon: "181" },
    { sort: "distance", lat: " ", lon: "127" },
    { sort: "distance", lat: "37" },
  ])("uses popular ordering for unsupported search parameters: %j", async (params) => {
    const { gyms } = await getGyms(params);
    expect(gyms[0].id).toBe("21");
  });

  it("orders by distance from valid coordinates", async () => {
    const { gyms } = await getGyms({ lat: "37.4979", lon: "127.0276" });
    expect(gyms[0].id).toBe("1");
    expect(gyms[0].distanceKm).toBe(0);
  });

  it("keeps keyword filtering when sorting and does not mutate the source", async () => {
    const { gyms } = await getGyms({ q: "  게이트원  ", sort: "popular" });
    expect(gyms.map((gym) => gym.id)).toEqual(["2"]);
    const { gyms: all } = await getGyms({});
    expect(all).toHaveLength(50);
  });

  it("labels recommended results separately when no gym matches", async () => {
    const result = await getGyms({ q: "존재하지않는암장" });
    expect(result.isFallback).toBe(true);
    expect(result.gyms).toHaveLength(6);
    expect(result.gyms[0].id).toBe("21");
  });
});

describe("distance", () => {
  it("accepts coordinates on the equator and prime meridian", () => {
    expect(getDistance(0, 0, 0, 1)).toBeCloseTo(111.195, 2);
    expect(getDistance(0, 0, 0, 0)).toBe(0);
  });

  it.each([[NaN, 127], [91, 127], [37, 181], [Infinity, 127]])(
    "places invalid coordinates last: %s, %s", (lat, lon) => {
      expect(getDistance(lat, lon, 37, 127)).toBe(Infinity);
    },
  );
});
