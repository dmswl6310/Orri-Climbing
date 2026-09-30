import type { Metadata } from "next";
import GymCard from "@/components/home/GymCard";
import SearchFallback from "@/components/search/SearchFallback";
import SearchHeader from "@/components/search/SearchHeader";
import SearchResultsHeader from "@/components/search/SearchResultsHeader";
import { getGyms, getSearchGymPool } from "@/services/gymService";
import { getAddressFromCoords } from "@/services/kakaoService";
import { normalizeSearch, type SearchParams } from "@/utils/search";

export const metadata: Metadata = { title: "암장 검색" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const { q, coordinates, invalidCoordinates } = normalizeSearch(params);
  const [{ gyms, isFallback }, pool, address] = await Promise.all([
    getGyms(params),
    getSearchGymPool(),
    coordinates ? getAddressFromCoords(String(coordinates.lat), String(coordinates.lon)) : Promise.resolve(""),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <SearchHeader gymSearchPool={pool} query={q} />
      <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
        {invalidCoordinates && <p role="status" className="mb-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">위치 정보가 올바르지 않아 인기순으로 표시합니다. 위치 검색을 다시 시도해주세요.</p>}
        {coordinates && !address && <p role="status" className="mb-4 text-sm text-gray-600">주소 이름을 확인하지 못했지만, 거리 정보는 현재 좌표를 기준으로 표시합니다.</p>}
        {isFallback ? <SearchFallback /> : <SearchResultsHeader address={address} q={q} totalCount={gyms.length} hasLocation={Boolean(coordinates)} />}
        <section aria-label={isFallback ? "추천 암장" : "검색 결과"}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {gyms.map((gym) => <GymCard key={gym.id} {...gym} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
