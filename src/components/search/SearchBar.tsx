"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { SearchGymSummary } from "@/services/gymService";
import SearchDropdown from "./SearchDropdown";
import LocationFinder from "../home/LocationFinder";

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
  const router = useRouter();
  const [inputText, setInputText] = useState(query);
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
    if (isLoading) return;
    if (!navigator.geolocation)
      return alert("GPS를 지원하지 않는 브라우저입니다."); // http일때 사용불가함

    setIsLoading(true);
    setUserLocation("위치 파악 중...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        setUserLocation("주변 암장 찾는 중...");
        router.push(`/search?lat=${latitude}&lon=${longitude}`);
      },
      (err) => {
        console.error("GPS Error: ", err);
        alert("위치 정보를 가져오는데 실패했습니다. GPS 권한을 확인해주세요.");
        setIsLoading(false);
        setUserLocation("내 위치로 검색");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000, // 5초이내 미응답시 에러발생
        maximumAge: 0, // 항상 새로운 위치 요청(캐시 미사용)
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
