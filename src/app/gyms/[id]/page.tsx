import { getGymById } from "@/services/gymService";
import { notFound } from "next/navigation";
import GymHero from "@/components/gym/GymHero";
import GymInfo from "@/components/gym/GymInfo";
import GymActionSide from "@/components/gym/GymActionSide";

export default async function GymDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gym = await getGymById(id);

  if (!gym) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <GymHero
        name={gym.name}
        address={gym.address}
        thumbnail={gym.thumbnail}
      />

      <main className="max-w-7xl mx-auto w-full px-6 md:px-16 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* 상세 정보 섹션 */}
        <GymInfo
          description={gym.description}
          hours={gym.hours}
          facilities={gym.facilities}
        />

        {/* 사이드 액션 섹션 */}
        <GymActionSide rating={gym.rating} scrapCount={gym.scrapCount} />
      </main>
    </div>
  );
}
