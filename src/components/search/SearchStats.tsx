interface SearchStatsProps {
  count: number;
}

const SearchStats = ({ count }: SearchStatsProps) => (
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-xl md:text-2xl font-bold text-gray-800">
      총 {count}개의 암장이 검색되었습니다.
    </h2>
  </div>
);

export default SearchStats;
