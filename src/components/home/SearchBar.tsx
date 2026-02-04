"use client";
import { useRouter } from "next/navigation";
import GpsIcon from "../icons/GpsIcon";
import RefreshIcon from "../icons/RefreshIcon";
import { useEffect, useState } from "react";

const SearchBar = () => {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState("내 위치로 검색");
  const [suggestions, setSuggestions] = useState([]);

  // 자동완성 디바운스 적용
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputText.length > 0) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/autocomplete?q=${encodeURIComponent(inputText)}`,
          );
          const data = await res.json();
          setSuggestions(data);
        } catch (error) {
          console.error("자동완성 에러:", error);
        }
      } else {
        setSuggestions([]);
      }
    }, 300); //0.3초 대기

    return () => clearTimeout(timer);
  }, [inputText]);

  const handleSearch = (query: string) => {
    if (!query) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
    setInputText(query);
  };

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

  return (
    <section className="px-6 md:px-16 -mt-7 relative z-20 max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-end px-1 mb-2.5">
        <button
          onClick={handleLocationSearch}
          className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <GpsIcon className="w-4 h-4" />
          <span className="truncate max-w-[150px]">{userLocation}</span>
        </button>

        <button onClick={handleLocationSearch} className="p-1 group">
          <RefreshIcon
            className={`w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-all ${isLoading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-[3] relative bg-white rounded-xl shadow-lg shadow-black/5 flex items-center px-5 py-3 md:py-3.5 border border-gray-100 focus-within:border-blue-200 transition-all">
          <span className="text-gray-400 mr-3 text-lg">🔍</span>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(inputText)}
            placeholder="지역 또는 암장 이름 검색"
            className="w-full outline-none text-sm md:text-base font-medium bg-transparent"
          />

          {/* 자동완성 드롭다운 (input이 있을 때만 노출) */}
          {inputText.length > 0 && suggestions.length > 0 && (
            <div className="absolute top-[110%] left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
              {suggestions.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSearch(item)}
                  className="px-5 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-50 last:border-0 flex items-center gap-2"
                >
                  <span className="text-gray-400">🔍</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => handleSearch(inputText)}
          className="flex-1 bg-slate-900 text-white rounded-xl px-8 py-3 md:py-3.5 shadow-md font-bold text-sm md:text-base hover:bg-slate-800 active:scale-[0.98] transition-all"
        >
          검색하기
        </button>
      </div>
    </section>
  );
};

export default SearchBar;
