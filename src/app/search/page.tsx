import GymCard from "@/components/home/GymCard";
import SearchHeader from "@/components/search/SearchHeader";
import SearchStats from "@/components/search/SearchStats";

export default function SearchPage() {
  const searchResults = [1, 2, 3, 4, 5, 6];

  return (
    <div className="flex flex-col min-h-screen">
      <SearchHeader />

      <main className="flex-1 p-6 md:p-16 max-w-7xl mx-auto w-full">
        <SearchStats count={searchResults.length} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {searchResults.map((item) => (
            <GymCard key={item} id={0} />
          ))}
        </div>
      </main>
    </div>
  );
}
