import MountainIcon from "@/components/icons/MountainIcon";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { SearchGymSummary } from "@/services/gymService";

const SearchHeader = ({
  gymSearchPool,
  query,
}: {
  gymSearchPool: SearchGymSummary[];
  query?: string;
}) => (
  <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm py-3 px-6 md:px-16 border-b border-gray-100">
    <div className="max-w-7xl mx-auto flex items-center gap-6">
      {/* 로고 영역 */}
      <button className="text-main-dark hover:text-main transition-colors">
        <MountainIcon className="w-7 h-7" />
      </button>

      <div className="flex-1">
        <SearchBar
          gymSearchPool={gymSearchPool}
          variant="float" // 헤더용 디자인으로 작동
          query={query} // 주소창의 검색어를 입력창에 표시
        />
      </div>
    </div>
  </header>
);

export default SearchHeader;
