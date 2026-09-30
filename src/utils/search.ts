export type SearchSort = "popular" | "distance";
export type SearchParams = Partial<Record<"q" | "lat" | "lon" | "sort" | "maxPrice" | "parking" | "shower" | "rental" | "beginner", string | string[]>>;
export const FACILITY_KEYS = ["parking", "shower", "rental"] as const;
export type Facility = (typeof FACILITY_KEYS)[number];
export const FACILITY_LABELS: Record<Facility, string> = { parking: "주차", shower: "샤워실", rental: "암벽화 대여" };
export const FILTER_KEYS = ["maxPrice", ...FACILITY_KEYS, "beginner"] as const;

export function validCoordinates(lat: number, lon: number) {
  return Number.isFinite(lat) && Number.isFinite(lon) &&
    lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}
const single = (value: string | string[] | undefined) =>
  typeof value === "string" ? value.trim() : "";

export function normalizeSearch(params: SearchParams) {
  const lat = single(params.lat);
  const lon = single(params.lon);
  const coordinates = lat && lon && validCoordinates(Number(lat), Number(lon))
    ? { lat: Number(lat), lon: Number(lon) } : null;
  const requestedSort = single(params.sort);
  const sort: SearchSort = coordinates && (!requestedSort || requestedSort === "distance")
    ? "distance" : "popular";
  const rawPrice = single(params.maxPrice);
  const maxPrice = /^\d{1,7}$/.test(rawPrice) && Number(rawPrice) <= 1000000 ? Number(rawPrice) : undefined;
  const filters = {
    maxPrice,
    parking: single(params.parking) === "1",
    shower: single(params.shower) === "1",
    rental: single(params.rental) === "1",
    beginner: single(params.beginner) === "1",
  };
  const invalidFilters = (params.maxPrice !== undefined && maxPrice === undefined && params.maxPrice !== "") ||
    [...FACILITY_KEYS, "beginner" as const].some((key) => params[key] !== undefined && params[key] !== "" && params[key] !== "1");
  return {
    q: single(params.q).slice(0, 100), coordinates, sort, filters, invalidFilters,
    hasFilters: maxPrice !== undefined || filters.parking || filters.shower || filters.rental || filters.beginner,
    invalidCoordinates: (params.lat !== undefined || params.lon !== undefined) && !coordinates,
  };
}

export function readSearchParams(params: Pick<URLSearchParams, "getAll">): SearchParams {
  return Object.fromEntries(["q", "lat", "lon", "sort", ...FILTER_KEYS].map((key) => {
    const values = params.getAll(key);
    return [key, values.length > 1 ? values : values[0]];
  }));
}

export function buildSearchHref(params: SearchParams = {}, patch: SearchParams = {}) {
  const merged = { ...params, ...patch };
  const { q, coordinates, sort, filters } = normalizeSearch(merged);
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (filters.maxPrice !== undefined) query.set("maxPrice", String(filters.maxPrice));
  for (const key of [...FACILITY_KEYS, "beginner" as const]) if (filters[key]) query.set(key, "1");
  if (coordinates) {
    query.set("lat", String(coordinates.lat));
    query.set("lon", String(coordinates.lon));
  }
  if (merged.sort !== undefined || coordinates) query.set("sort", sort);
  return query.size ? `/search?${query}` : "/search";
}
