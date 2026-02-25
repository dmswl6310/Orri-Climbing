import { MOCK_GYMS } from "@/constants/gyms";
import { cache } from "react";

export interface SearchGymSummary {
  id: string;
  name: string;
  district: string;
  address: string;
}

export interface GetGymsResponse {
  gyms: typeof MOCK_GYMS;
  isFallback: boolean;
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

// 메인 페이지와 검색페이지에서의 중복호출(서버에서 호출)
const PRE_POOL: SearchGymSummary[] = MOCK_GYMS.map((gym) => ({
  id: gym.id,
  name: gym.name,
  district: gym.district,
  address: gym.address,
}));

export const getSearchGymPool = cache(async (): Promise<SearchGymSummary[]> => {
  return PRE_POOL;
  // db를 쓴다면
  // async () => {
  //   const { data } = await supabase.from('gyms').select('id, name, district, address');
  //   return data;
  // },
  // ["search-gym-pool"], // 전역 캐시 키
  // { revalidate: 86400 } // 24시간 마다 한번식 가져오기
});

export async function getGyms({
  q,
  address,
}: {
  q?: string;
  address?: string;
}): Promise<GetGymsResponse> {
  let results = [...MOCK_GYMS];
  let isFallback = false;

  // 1. 주소 필터링
  if (address) {
    const [gu, dong] = address.split(" ");
    results = results.filter(
      (gym) =>
        gym.district.includes(gu) || (dong && gym.address.includes(dong)),
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
