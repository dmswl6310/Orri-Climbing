import { MOCK_GYMS } from "@/constants/gyms";
import type { GymCardData, GymDetail, SearchGymSummary } from "@/types/gyms/types";
import { getDistance } from "@/utils.math";
import { FACILITY_KEYS, normalizeSearch, type SearchParams } from "@/utils/search";
import { getDailyPrice, getFacilityStatus } from "@/utils/gymFacts";

export type GymSearchResult = GymDetail & { distanceKm?: number };
export interface GetGymsResponse {
  gyms: GymSearchResult[];
  recommendations: GymSearchResult[];
  isFallback: boolean;
}
// Explicit demo display order, independent of fictitious rating/save counts.
const FEATURED_IDS = ["21", "1", "31"];
const DISPLAY_IDS = [...FEATURED_IDS, ...MOCK_GYMS.map(({ id }) => id).filter((id) => !FEATURED_IDS.includes(id))];
const DISPLAY_RANK = new Map(DISPLAY_IDS.map((id, index) => [id, index]));
const byDisplayOrder = (a: GymDetail, b: GymDetail) => (DISPLAY_RANK.get(a.id) ?? Infinity) - (DISPLAY_RANK.get(b.id) ?? Infinity);
export async function getFeaturedGyms(limit = 3) {
  return [...MOCK_GYMS].sort(byDisplayOrder).slice(0, limit);
}
export async function getGymById(id: string) {
  return MOCK_GYMS.find((gym) => gym.id === id) ?? null;
}
const SEARCH_POOL: SearchGymSummary[] = MOCK_GYMS.map(({ id, name, district, address }) => ({
  id, name, district, address,
}));
export async function getSearchGymPool(): Promise<SearchGymSummary[]> {
  return SEARCH_POOL;
}
export async function getGymCardCatalog(): Promise<GymCardData[]> {
  return MOCK_GYMS.map(({ id, name, thumbnail, district, tags, facilities, prices, amenities, beginnerLesson, isDemo }) =>
    ({ id, name, thumbnail, district, tags, facilities, prices, amenities, beginnerLesson, isDemo }));
}

export function filterGyms(gyms: GymDetail[], params: SearchParams) {
  const { q, filters } = normalizeSearch(params);
  const keyword = q.toLowerCase();
  return gyms.filter((gym) => {
    if (![gym.name, gym.district, gym.address].some((text) => text.toLowerCase().includes(keyword))) return false;
    const price = getDailyPrice(gym);
    if (filters.maxPrice !== undefined && (price === undefined || price > filters.maxPrice)) return false;
    if (filters.beginner && gym.beginnerLesson !== true) return false;
    return FACILITY_KEYS.every((key) => !filters[key] || getFacilityStatus(gym, key) === true);
  });
}

export async function getGyms(params: SearchParams): Promise<GetGymsResponse> {
  const { coordinates, sort } = normalizeSearch(params);
  const withDistance = (gym: GymDetail): GymSearchResult => ({
    ...gym,
    ...(coordinates ? { distanceKm: getDistance(coordinates.lat, coordinates.lon, gym.lat, gym.lon) } : {}),
  });
  const gyms = filterGyms(MOCK_GYMS, params).map(withDistance);
  gyms.sort((a, b) => sort === "distance"
    ? (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity) || byDisplayOrder(a, b)
    : byDisplayOrder(a, b));
  const recommendations = gyms.length ? [] : (await getFeaturedGyms(6)).map(withDistance);
  return { gyms, recommendations, isFallback: gyms.length === 0 };
}
