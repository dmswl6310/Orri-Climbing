import { useSearchAutocomplete } from "@/hooks/useSearchAutocomplete";
import { SearchGymSummary } from "@/services/gymService";
import { useRouter } from "next/navigation";
import RefreshIcon from "../icons/RefreshIcon";
import GpsIcon from "../icons/GpsIcon";
import SearchDropdown from "./SearchDropdown";

interface SearchInputBoxProps {
  gymSearchPool: SearchGymSummary[];
  query: string;
  isFloat: boolean;
  isLoading: boolean;
  onLocationSearch: () => void;
}

export default function SearchInputBox({
  gymSearchPool,
  query,
  isFloat,
  isLoading,
  onLocationSearch,
}: SearchInputBoxProps) {
  const router = useRouter();

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsDropdownOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // 커스텀 훅
  const {
    inputText,
    setInputText,
    isDropdownOpen,
    setIsDropdownOpen,
    searchRef,
    suggestions,
  } = useSearchAutocomplete(gymSearchPool, query);

  return (
    <div
      className={`flex ${isFloat ? "flex-row items-center gap-2" : "flex-col sm:flex-row gap-3"}`}
    >
      <div
        ref={searchRef}
        className={`${isFloat ? "flex-1 py-2" : "flex-[3] py-3"} relative bg-white rounded-xl shadow-lg shadow-black/5 flex items-center px-5 border border-gray-100 focus-within:border-blue-200 transition-all`}
      >
        {isFloat && (
          <button
            onClick={onLocationSearch}
            disabled={isLoading}
            className="mr-2 text-gray-400 hover:text-slate-900 transition-colors"
          >
            {isLoading ? (
              <RefreshIcon className="animate-spin w-4 h-4" />
            ) : (
              <GpsIcon className="w-4 h-4" />
            )}
          </button>
        )}
        <span className="text-gray-400 mr-3">🔍</span>
        <input
          type="text"
          value={inputText}
          onFocus={() => setIsDropdownOpen(true)}
          onChange={(e) => {
            setInputText(e.target.value);
            setIsDropdownOpen(true);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(inputText)}
          placeholder="지역 또는 암장 이름 검색"
          className="w-full outline-none text-sm md:text-base font-medium bg-transparent"
        />

        {/* 자동완성 드롭다운 */}
        {isDropdownOpen && suggestions.length > 0 && (
          <SearchDropdown
            suggestions={suggestions}
            onSelect={(id) => {
              setIsDropdownOpen(false);
              router.push(`/gyms/${id}`);
            }}
          />
        )}
      </div>
      <button
        onClick={() => handleSearch(inputText)}
        className={`bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all ${
          isFloat ? "px-5 py-2 whitespace-nowrap" : "flex-1 px-8 py-3 shadow-md"
        }`}
      >
        검색{isFloat ? "" : "하기"}
      </button>
    </div>
  );
}
