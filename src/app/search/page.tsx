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

  const searchResultGyms = await getGyms({ q, address });

  // const title = address
  //   ? `${address} 주변 암장`
  //   : q
  //     ? `"${q}" 검색 결과`
  //     : "추천 인기 암장";

  return (
    <div className="flex flex-col min-h-screen">
      <SearchHeader />
      <main className="flex-1 p-6 md:p-16 max-w-7xl mx-auto w-full">
        <SearchStats count={searchResultGyms.length} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {searchResultGyms.map((gym) => (
            <GymCard key={gym.id} {...gym} />
          ))}
        </div>
      </main>
    </div>
  );
}
