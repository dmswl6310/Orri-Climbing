import HeroSection from "@/components/home/HeroSection";
import SearchBar from "@/components/search/SearchBar";
import PopularGyms from "@/components/home/PopularGyms";
import { getSearchGymPool } from "@/services/gymService";

export const revalidate = 604800; // 1주일

export default async function HomePage() {
  const gymSearchPool = await getSearchGymPool();

  return (
    <main className="flex-1 overflow-x-hidden">
      <HeroSection />
      <SearchBar gymSearchPool={gymSearchPool} variant="main" />
      <PopularGyms />
    </main>
  );
}
