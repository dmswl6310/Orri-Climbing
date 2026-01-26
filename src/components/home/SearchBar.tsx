"use client";
import { useRouter } from "next/navigation";
import GpsIcon from "../icons/GpsIcon";
import RefreshIcon from "../icons/RefreshIcon";

const SearchBar = () => {
  const router = useRouter();

  const handleSearch = () => {
    router.push(`/search?q=${encodeURIComponent("글자")}`);
  };

  return (
    <section className="px-6 md:px-16 -mt-7 relative z-20 max-w-4xl mx-auto">
      <div className="flex justify-between items-center px-1">
        <button
          // onClick={handleLocationSearch}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600"
        >
          <GpsIcon />
          <span>위치</span>
        </button>
        <RefreshIcon
        // className="text-gray-400 cursor-pointer"
        // onClick={handleLocationSearch}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex-[3] bg-white rounded-xl shadow-lg shadow-black/5 flex items-center px-5 py-2.5 md:py-3 border border-gray-100">
          <span className="text-gray-400 mr-3">🔍</span>
          <input
            type="text"
            placeholder="지역 또는 암장 이름 검색"
            className="w-full outline-none text-sm md:text-base font-medium"
          />
        </div>
        <button
          onClick={handleSearch}
          className="flex-1 bg-main-dark text-white rounded-xl px-6 py-2.5 md:py-3 shadow-md font-bold text-sm md:text-base hover:brightness-110 transition-all"
        >
          검색
        </button>
      </div>
    </section>
  );
};

export default SearchBar;
