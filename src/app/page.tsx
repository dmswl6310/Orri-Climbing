import HeroSection from "@/components/home/HeroSection";
import SearchBar from "@/components/home/SearchBar";
import PopularGyms from "@/components/home/PopularGyms";

export default function HomePage() {
  return (
    <main className="flex-1 overflow-x-hidden">
      <HeroSection />
      <SearchBar />
      <PopularGyms />

      <div className="flex justify-center mb-20 px-6">
        <button className="px-10 py-3 bg-white border border-gray-200 text-gray-600 rounded-full font-bold text-sm hover:bg-gray-50 transition-all shadow-sm">
          암장 더 불러오기
        </button>
      </div>
    </main>
  );
}
