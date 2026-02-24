"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SearchGymSummary } from "@/services/gymService";
import SearchDropdown from "./SearchDropdown";
import LocationFinder from "../home/LocationFinder";
import GpsIcon from "../icons/GpsIcon";
import RefreshIcon from "../icons/RefreshIcon";

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

  const isFloat = variant === "float";

  useEffect(() => {
    setInputText(query);
  }, [query]);

  // 자동완성 리스트
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

  // gps 검색
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
        setIsLoading(false);
      },
      (err) => {
        console.error("GPS Error: ", err);
        alert("위치 정보를 가져오는데 실패했습니다. GPS 권한을 확인해주세요.");
        setIsLoading(false);
        setUserLocation("내 위치로 검색");
      },
      // {
      //   enableHighAccuracy: true,
      //   timeout: 5000, // 5초이내 미응답시 에러발생
      //   maximumAge: 0, // 항상 새로운 위치 요청(캐시 미사용)
      // },
    );
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

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

      <div
        className={`flex ${isFloat ? "flex-row items-center gap-2" : "flex-col sm:flex-row gap-3"}`}
      >
        {/* 검색창 영역 (main일때와 flaot상태일때 다르게)*/}
        <div
          className={`${isFloat ? "flex-1 py-2" : "flex-[3] py-3"} relative bg-white rounded-xl shadow-lg shadow-black/5 flex items-center px-5 border border-gray-100 focus-within:border-blue-200 transition-all`}
        >
          {isFloat && (
            <button
              onClick={handleLocationSearch}
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
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(inputText)}
            placeholder="지역 또는 암장 이름 검색"
            className="w-full outline-none text-sm md:text-base font-medium bg-transparent"
          />
          {/* 자동완성 드롭다운 */}
          <SearchDropdown
            suggestions={suggestions}
            onSelect={(id) => router.push(`/gyms/${id}`)}
          />
        </div>
        <button
          onClick={() => handleSearch(inputText)}
          className={`bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all ${
            isFloat
              ? "px-5 py-2 whitespace-nowrap"
              : "flex-1 px-8 py-3 shadow-md"
          }`}
        >
          검색{isFloat ? "" : "하기"}
        </button>
      </div>
    </section>
  );
};

export default SearchBar;
