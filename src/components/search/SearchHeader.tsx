import MountainIcon from "@/components/icons/MountainIcon";

const SearchHeader = () => (
  <header className="sticky top-0 z-50 bg-white shadow-sm py-4 px-6 md:px-16 border-b border-gray-100">
    <div className="max-w-6xl mx-auto flex items-center gap-4">
      <button className="text-main-dark hover:text-main transition-colors">
        <MountainIcon className="w-7 h-7" />
      </button>

      <div className="flex-1 flex bg-gray-50 rounded-lg border border-gray-100 px-4 py-2 focus-within:border-main-light focus-within:ring-1 focus-within:ring-main-light/30 transition-all">
        <span className="text-gray-400 mr-2">🔍</span>
        <input
          type="text"
          placeholder="지역, 암장 이름 또는 특징으로 검색"
          className="w-full outline-none text-sm md:text-base font-medium bg-transparent"
        />
        <button className="ml-2 text-main-dark hover:text-main font-bold text-sm hidden sm:block">
          검색
        </button>
      </div>
    </div>
  </header>
);

export default SearchHeader;
