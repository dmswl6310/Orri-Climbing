import { MOCK_GYMS } from "@/constants/gyms";

export interface SearchGymSummary {
  id: string;
  name: string;
  district: string;
  address: string;
}

export async function getPopularGyms(limit: number = 3) {
  // 실제 DB 연동 시
  // const { data } = await supabase.from('gyms').select('*').order('scrap_count', { ascending: false }).limit(3);
  // return data;

  // 현재는 목업 데이터
  return [...MOCK_GYMS]
    .sort((a, b) => b.scrapCount - a.scrapCount)
    .slice(0, limit);
}

export async function getGymById(id: string) {
  return MOCK_GYMS.find((g) => g.id === id) || null;
}

export async function getSearchGymPool() {
  return MOCK_GYMS.map((gym) => ({
    id: gym.id,
    name: gym.name,
    district: gym.district,
    address: gym.address,
  }));
}
