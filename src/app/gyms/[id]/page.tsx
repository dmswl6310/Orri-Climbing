import { getGymById } from "@/services/gymService";
import { notFound } from "next/navigation";
import GymHero from "@/components/gym/GymHero";
import GymInfo from "@/components/gym/GymInfo";
import GymActionSide from "@/components/gym/GymActionSide";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const gym = await getGymById((await params).id);
  return { title: gym?.name ?? "암장을 찾을 수 없습니다", description: gym?.description };
}

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

      <div className="max-w-7xl mx-auto w-full px-6 md:px-16 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* 상세 정보 섹션 */}
        <GymInfo
          description={gym.description}
          hours={gym.hours}
          facilities={gym.facilities}
          prices={gym.prices}
          difficultySystem={gym.difficultySystem}
          beginnerLesson={gym.beginnerLesson}
        />

        {/* 사이드 액션 섹션 */}
        <GymActionSide id={gym.id} name={gym.name} />
      </div>
    </div>
  );
}
