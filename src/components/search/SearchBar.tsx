"use client";

import { SearchGymSummary } from "@/services/gymService";
import LocationFinder from "../home/LocationFinder";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import SearchInputBox from "./SearchInputBox";

interface SearchBarProps {
  gymSearchPool: SearchGymSummary[];
  variant?: "main" | "float";
  query?: string;
}

const SearchBar = ({
  gymSearchPool,
  variant = "main",
  query = "",
}: SearchBarProps) => {
  const isFloat = variant === "float";
  const { isLoading, userLocation, handleLocationSearch } = useLocationSearch();

  return (
    // float일땐 꽉차게, 메인에선 크게
    <section
      className={
        isFloat
          ? "w-full"
          : "px-6 md:px-16 -mt-7 relative z-20 max-w-4xl mx-auto w-full"
      }
    >
      {/* 메인 모드일 때만 원래 크기의 LocationFinder 표시 */}
      {!isFloat && (
        <LocationFinder
          userLocation={userLocation}
          isLoading={isLoading}
          onLocationSearch={handleLocationSearch}
        />
      )}

      <SearchInputBox
        gymSearchPool={gymSearchPool}
        query={query}
        isFloat={isFloat}
        isLoading={isLoading}
        onLocationSearch={handleLocationSearch}
      />
    </section>
  );
};

export default SearchBar;
