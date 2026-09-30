export type SearchSort = "popular" | "distance";
export type SearchParams = {
  q?: string | string[];
  lat?: string | string[];
  lon?: string | string[];
  sort?: string | string[];
};

export function validCoordinates(lat: number, lon: number) {
  return Number.isFinite(lat) && Number.isFinite(lon) &&
    lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

const single = (value: string | string[] | undefined) =>
  typeof value === "string" ? value.trim() : "";

// Repeated parameters are ignored instead of being coerced into strings.
export function normalizeSearch(params: SearchParams) {
  const lat = single(params.lat);
  const lon = single(params.lon);
  const coordinates = lat && lon && validCoordinates(Number(lat), Number(lon))
    ? { lat: Number(lat), lon: Number(lon) } : null;
  const requestedSort = single(params.sort);
  const sort: SearchSort = coordinates && (!requestedSort || requestedSort === "distance")
    ? "distance" : "popular";
  return {
    q: single(params.q), coordinates, sort,
    invalidCoordinates: (params.lat !== undefined || params.lon !== undefined) && !coordinates,
  };
}
