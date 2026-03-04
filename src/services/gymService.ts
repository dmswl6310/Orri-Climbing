import { MOCK_GYMS } from "@/constants/gyms";
import { GymDetail } from "@/types/gyms/types";
import { getDistance } from "@/utils.math";
import { unstable_cache } from "next/cache";

export interface SearchGymSummary {
  id: string;
  name: string;
  district: string;
  address: string;
}

export interface GetGymsResponse {
  gyms: GymDetail[];
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

export async function getSearchGymPool(): Promise<SearchGymSummary[]> {
  return PRE_POOL;
}

// db를 쓴다면
// export const getSearchGymPool = unstable_cache(
//   async () => {
//     const { data } = await supabase
//       .from("gyms")
//       .select("id, name, district, address");
//     return data;
//   },
//   ["search-gym-pool"], // 캐시 키
//   {
//     revalidate: 86400, // 24시간 마다 한번식 가져오기
//     tags: ["search-gym-pool"], // revalidateTag하면 24시간 기준 상관없이 업데이트함)
//   },
// );

export async function getGyms({
  q,
  lat,
  lon,
  sort,
}: {
  q?: string;
  lat?: string;
  lon?: string;
  sort?: string;
}): Promise<GetGymsResponse> {
  let results = [...MOCK_GYMS];
  let isFallback = false;

  // 1단계 : 키워드로 필터링(q 있을 때만)
  if (q) {
    const keyword = q.toLowerCase().trim();
    results = results.filter(
      (gym) =>
        gym.name.toLowerCase().includes(keyword) ||
        gym.district.includes(keyword) ||
        gym.address.includes(keyword),
    );
  }

  // 정렬 기준 정하기
  const currentSort = sort || (lat && lon ? "distance" : "popular");

  // 2단계 : 정렬 실행
  if (currentSort === "distance" && lat && lon) {
    const userLat = Number(lat);
    const userLon = Number(lon);
    results.sort(
      (a, b) =>
        getDistance(userLat, userLon, a.lat, a.lon) -
        getDistance(userLat, userLon, b.lat, b.lon),
    );
  } else if (sort === "popular") {
    results.sort((a, b) => b.scrapCount - a.scrapCount);
  }
  // currentSort==="newest"라면 기본 배열 유지

  // 3단계 : 검색 결과가 0개면 fallback 처리
  if (results.length === 0) {
    isFallback = true;
    results = await getPopularGyms(6);
  }

  return {
    gyms: results,
    isFallback: isFallback,
  };
}
