import { MOCK_GYMS } from "@/constants/gyms";

export async function getPopularGyms(limit: number = 3) {
  //   const res = await fetch(
  //     `${process.env.NEXT_PUBLIC_BASE_URL}/api/gyms/popular`,
  //     {
  //       next: { revalidate: 3600 },
  //     },
  //   );

  //   if (!res.ok) return [];
  //   return res.json();

  // 실제로는 DB에서 scrapCount 내림차순으로 가져오는 로직이 들어감
  return [...MOCK_GYMS]
    .slice(0, limit)
    .sort((a, b) => b.scrapCount - a.scrapCount);
}

export async function getGymById(id: string) {
  return MOCK_GYMS.find((g) => g.id === id) || null;
}
