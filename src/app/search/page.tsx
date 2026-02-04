import SearchHeader from "@/components/search/SearchHeader";
import SearchStats from "@/components/search/SearchStats";

async function getAddressFromCoords(lat: string, lon: string) {
  const res = await fetch(
    `https://dapi.kakao.com/v2/local/geo/coord2regioncode?x=${lon}&y=${lat}`,
    {
      headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` },
    },
  );
  const data = await res.json();
  const haengjeongDong = data.documents.find(
    (doc: KakaoRegionDocument) => doc.region_type === "H",
  );
  const region = haengjeongDong ? haengjeongDong : data.documents[0];
  const displayAddress = `${region.region_2depth_name} ${region.region_3depth_name}`;

  console.log(displayAddress);
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; lat?: string; lon?: string }>;
}) {
  const { q, lat, lon } = await searchParams;
  const filteredGyms = [];

  // if(!(q||lat||lon))
  if (lat && lon) {
    getAddressFromCoords(lat, lon);
    // filteredGyms = MOCK_GYMS.filter((gym) =>
    //   gym.district.includes(displayAddr),
    // );
  } else if (q) {
    // filteredGyms = MOCK_GYMS.filter(
    //   (gym) => gym.name.includes(q) || gym.district.includes(q),
    // );
  }
  const searchResults = [1, 2, 3, 4, 5, 6];

  return (
    <div className="flex flex-col min-h-screen">
      <SearchHeader />

      <main className="flex-1 p-6 md:p-16 max-w-7xl mx-auto w-full">
        <SearchStats count={searchResults.length} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* {searchResults.map((item) => (
            <GymCard key={item} />
          ))} */}
        </div>
      </main>
    </div>
  );
}
