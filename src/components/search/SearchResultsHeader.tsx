import SearchFilter from "./SearchFilter";

interface SearchResultsHeaderProps {
  address: string;
  q?: string;
  totalCount: number;
}

export default function SearchResultsHeader({
  address,
  q,
  totalCount,
}: SearchResultsHeaderProps) {
  /* 검색 결과 있을 때 */
  return (
    <section className="mb-8 border-b border-gray-200 pb-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            {address ? `📍 ${address} 주변` : `🔍 "${q}"`} 검색 결과
          </h2>
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
