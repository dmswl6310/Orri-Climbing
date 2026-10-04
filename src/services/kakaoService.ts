import { normalizeSearch } from "@/utils/search";
import type { KakaoRegionDocument } from "@/types/kakao/type";

function isRegion(value: unknown): value is KakaoRegionDocument {
  if (!value || typeof value !== "object") return false;
  const region = value as Record<string, unknown>;
  return (region.region_type === "H" || region.region_type === "B") &&
    typeof region.region_2depth_name === "string" && typeof region.region_3depth_name === "string";
}

export async function getAddressFromCoords(lat: string, lon: string) {
  const { coordinates } = normalizeSearch({ lat, lon });
  const key = process.env.KAKAO_REST_API_KEY;
  if (!coordinates || !key) return "";
  try {
    const query = new URLSearchParams({ x: String(coordinates.lon), y: String(coordinates.lat) });
    const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2regioncode?${query}`, {
      headers: { Authorization: `KakaoAK ${key}` },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return "";
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("documents" in data) || !Array.isArray(data.documents)) return "";
    const regions = data.documents.filter(isRegion);
    const region = regions.find((item) => item.region_type === "H") ?? regions[0];
    return region ? `${region.region_2depth_name} ${region.region_3depth_name}`.trim() : "";
  } catch {
    // Address labels are optional: distance sorting still works without Kakao.
    return "";
  }
}
