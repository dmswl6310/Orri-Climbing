import GymCard from "@/components/home/GymCard";
import SearchFallback from "@/components/search/SearchFallback";
import SearchHeader from "@/components/search/SearchHeader";
import SearchResultsHeader from "@/components/search/SearchResultsHeader";
import { getGyms, getSearchGymPool } from "@/services/gymService";
import { getAddressFromCoords } from "@/services/kakaoService";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    lat?: string;
    lon?: string;
    sort?: string;
  }>;
}) {
  const { q, lat, lon, sort } = await searchParams;
  let address = "";

  // 1. 카카오 API로 주소 가져오기
  if (lat && lon) {
    address = await getAddressFromCoords(lat, lon);
  }

  // 2. DB에서 암장 데이터 가져오기 (병렬 처리)
  const [gymData, pool] = await Promise.all([
    getGyms({ q, lat, lon, sort }),
    getSearchGymPool(),
  ]);

  const { gyms = [], isFallback } = gymData || {};

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SearchHeader gymSearchPool={pool} query={q} />

      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {/* 조건부 헤더 렌더링 */}
        {isFallback ? (
          <SearchFallback />
        ) : (
          <SearchResultsHeader
            address={address}
            q={q}
            totalCount={gyms.length}
          />
        )}

        {/* 암장 리스트 */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {gyms.map((gym) => (
              <GymCard key={gym.id} {...gym} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
