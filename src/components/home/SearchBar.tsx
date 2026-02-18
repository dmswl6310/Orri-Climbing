"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { SearchGymSummary } from "@/services/gymService";
import SearchDropdown from "./SearchDropdown";
import LocationFinder from "./LocationFinder";

const SearchBar = ({
  gymSearchPool,
}: {
  gymSearchPool: SearchGymSummary[];
}) => {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState("내 위치로 검색");

  const suggestions = useMemo(() => {
    const keyword = inputText.trim().toLowerCase();
    if (!keyword) return [];
    return gymSearchPool
      .filter(
        (gym: SearchGymSummary) =>
          gym.name.toLowerCase().includes(keyword) ||
          gym.district.includes(keyword) ||
          gym.address.toLowerCase().includes(keyword),
      )
      .slice(0, 8);
  }, [inputText, gymSearchPool]);

  const handleLocationSearch = () => {
    if (!navigator.geolocation)
      return alert("GPS를 지원하지 않는 브라우저입니다.");
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation("검색 중...");
        router.push(`/search?lat=${latitude}&lon=${longitude}`);
        setIsLoading(false);
      },
      () => {
        alert("위치 정보를 가져오는데 실패했습니다.");
        setIsLoading(false);
      },
    );
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="px-6 md:px-16 -mt-7 relative z-20 max-w-4xl mx-auto w-full">
      {/* 1. 위치 정보 컴포넌트 */}
      <LocationFinder
        userLocation={userLocation}
        isLoading={isLoading}
        onLocationSearch={handleLocationSearch}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-[3] relative bg-white rounded-xl shadow-lg shadow-black/5 flex items-center px-5 py-3 border border-gray-100 focus-within:border-blue-200 transition-all">
          <span className="text-gray-400 mr-3">🔍</span>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(inputText)}
            placeholder="지역 또는 암장 이름 검색"
            className="w-full outline-none text-sm md:text-base font-medium bg-transparent"
          />

          {/* 2. 자동완성 드롭다운 컴포넌트 */}
          <SearchDropdown
            suggestions={suggestions}
            onSelect={(id) => router.push(`/gyms/${id}`)}
          />
        </div>

        <button
          onClick={() => handleSearch(inputText)}
          className="flex-1 bg-slate-900 text-white rounded-xl px-8 py-3 shadow-md font-bold hover:bg-slate-800 transition-all"
        >
          검색하기
        </button>
      </div>
    </section>
  );
};

export default SearchBar;
