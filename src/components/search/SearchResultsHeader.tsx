import SearchFilter from "./SearchFilter";

interface SearchResultsHeaderProps {
  address: string;
  q?: string;
  totalCount: number;
  hasLocation?: boolean;
}

export default function SearchResultsHeader({
  address,
  q,
  totalCount,
  hasLocation = false,
}: SearchResultsHeaderProps) {
  /* 검색 결과 있을 때 */
  return (
    <section className="mb-8 border-b border-gray-200 pb-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            {q ? `“${q}” 검색 결과` : hasLocation ? "내 위치 기준 암장 목록" : "전체 암장"}
          </h1>
          {hasLocation && <p className="mt-2 text-sm text-gray-600">{address ? `${address} 기준` : "현재 위치 기준"} · 거리는 직선거리입니다.</p>}
          <p className="text-blue-600 font-bold mt-2">
            총 {totalCount}개의 암장
          </p>
        </div>

        {/* 필터 버튼 */}
        <SearchFilter />
      </div>
    </section>
  );
}
