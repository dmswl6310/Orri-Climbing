import { MOCK_GYMS } from "@/constants/gyms";
import type { GymDetail, SearchGymSummary } from "@/types/gyms/types";
import { getDistance } from "@/utils.math";
import { normalizeSearch, type SearchParams } from "@/utils/search";

export interface GetGymsResponse {
  gyms: (GymDetail & { distanceKm?: number })[];
  isFallback: boolean;
}

export async function getPopularGyms(limit = 3) {
  return [...MOCK_GYMS].sort((a, b) => b.scrapCount - a.scrapCount).slice(0, limit);
}

export async function getGymById(id: string) {
  return MOCK_GYMS.find((gym) => gym.id === id) ?? null;
}

// Static mock summaries, not a persistent database cache.
const SEARCH_POOL: SearchGymSummary[] = MOCK_GYMS.map(({ id, name, district, address }) => ({
  id, name, district, address,
}));

export async function getSearchGymPool(): Promise<SearchGymSummary[]> {
  return SEARCH_POOL;
}

export async function getGyms(params: SearchParams): Promise<GetGymsResponse> {
  const { q, coordinates, sort } = normalizeSearch(params);
  const keyword = q.toLowerCase();
  let results = MOCK_GYMS.filter((gym) =>
    [gym.name, gym.district, gym.address].some((text) => text.toLowerCase().includes(keyword)),
  );
  const isFallback = results.length === 0;
  if (isFallback) results = await getPopularGyms(6);
  const gyms = results.map((gym) => ({
    ...gym,
    ...(coordinates ? { distanceKm: getDistance(coordinates.lat, coordinates.lon, gym.lat, gym.lon) } : {}),
  }));
  gyms.sort((a, b) => !isFallback && sort === "distance"
    ? (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity) || b.scrapCount - a.scrapCount
    : b.scrapCount - a.scrapCount);
  return { gyms, isFallback };
}
