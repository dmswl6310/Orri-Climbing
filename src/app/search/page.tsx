import GymCard from "@/components/home/GymCard";
import SearchHeader from "@/components/search/SearchHeader";
import SearchStats from "@/components/search/SearchStats";
import { getGyms } from "@/services/gymService";

async function getAddressFromCoords(lat: string, lon: string) {
  try {
    const res = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2regioncode?x=${lon}&y=${lat}`,
      {
        headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return ""; // 에러나 문제 생기면 빈문자열 반환

    const data = await res.json();
    if (!data.documents?.length) return "";

    const haengjeongDong = data.documents.find(
      (doc: KakaoRegionDocument) => doc.region_type === "H",
    );
    const region = haengjeongDong ? haengjeongDong : data.documents[0];
    return `${region.region_2depth_name} ${region.region_3depth_name}`;
  } catch (error) {
    console.error("Kakao AI Error: ", error);
    return "";
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; lat?: string; lon?: string }>;
}) {
  const { q, lat, lon } = await searchParams;
  let address = "";

  if (lat && lon) {
    address = await getAddressFromCoords(lat, lon);
  }

  const { gyms, isFallback } = await getGyms({ q, address });

  // const title = address
  //   ? `${address} 주변 암장`
  //   : q
  //     ? `"${q}" 검색 결과`
  //     : "추천 인기 암장";

  return (
    <div className="flex flex-col min-h-screen">
      {/* <SearchHeader gymSearchPool={pool} query={q} /> */}
      <main className="p-6 md:p-16 max-w-7xl mx-auto w-full">
        {isFallback ? (
          <div className="mb-12 p-8 bg-gray-50 rounded-2xl text-center">
            <span className="text-4xl mb-4 block">🏝️</span>
            <h2 className="text-xl font-bold text-gray-800">
              검색 결과가 없어요
            </h2>
            <p className="text-gray-500 mt-2">
              대신 요즘 가장 핫한 암장들을 추천해 드릴게요!
            </p>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900">
              {address ? `${address} 주변` : `"${q}"`} 검색 결과
            </h2>
            <p className="text-gray-500 mt-1">
              {gyms.length}개의 암장을 찾았습니다.
            </p>
          </div>
        )}

        {/* 2. 리스트 렌더링 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gyms.map((gym) => (
            <GymCard key={gym.id} {...gym} />
          ))}
        </div>
      </main>
    </div>
  );
}
