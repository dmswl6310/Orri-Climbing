import { MOCK_GYMS } from "@/constants/gyms";
import { GymDetail } from "@/types/gyms/types";

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

export async function getGyms({
  q,
  address,
}: {
  q?: string;
  address?: string;
}) {
  let results = [...MOCK_GYMS];
  let isFallback = false;

  if (address) {
    const [gu, dong] = address.split(" ");
    results = results.filter(
      (gym) => gym.district.includes(gu) || gym.address.includes(dong),
    );
  } else if (q) {
    const keyword = q.toLowerCase().trim();
    results = results.filter(
      (gym) =>
        gym.name.toLowerCase().includes(keyword) ||
        gym.district.includes(keyword) ||
        gym.address.includes(keyword),
    );
  }

  // 결과없으면 인기순 리스트 반환
  if (results.length === 0 || (!q && !address)) {
    isFallback = true;
    results = await getPopularGyms(6);
  }

  return {
    gyms: results,
    isFallback: isFallback,
  };
}
