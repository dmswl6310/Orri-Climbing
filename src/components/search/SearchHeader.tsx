import MountainIcon from "@/components/icons/MountainIcon";
import Link from "next/link";
import SearchBar from "./SearchBar";
import type { SearchGymSummary } from "@/types/gyms/types";
import type { SearchParams } from "@/utils/search";

const SearchHeader = ({
  gymSearchPool,
  query,
  searchContext,
}: {
  gymSearchPool: SearchGymSummary[];
  query?: string;
  searchContext?: SearchParams;
}) => (
  <header className="sticky top-14 md:top-16 z-40 bg-white/90 backdrop-blur-md shadow-sm py-3 px-4 md:px-16 border-b border-gray-100">
    <div className="max-w-7xl mx-auto flex items-center gap-3 md:gap-6">
      {/* 로고 영역 */}
      <Link href="/" aria-label="오르리 홈" className="text-main-dark hover:text-main transition-colors">
        <MountainIcon className="w-7 h-7" />
      </Link>

      <div className="flex-1 min-w-0">
        <SearchBar
          gymSearchPool={gymSearchPool}
          variant="float" // 헤더용 디자인으로 작동
          query={query} // 주소창의 검색어를 입력창에 표시
          searchContext={searchContext}
        />
      </div>
    </div>
  </header>
);

export default SearchHeader;
