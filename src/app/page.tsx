import HeroSection from "@/components/home/HeroSection";
import SearchBar from "@/components/home/SearchBar";
import PopularGyms from "@/components/home/PopularGyms";

export default function HomePage() {
  return (
    <main className="flex-1 overflow-x-hidden">
      <HeroSection />
      <SearchBar />
      <PopularGyms />
    </main>
  );
}
