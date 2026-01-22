import GymHero from "@/components/gym/GymHero";
import GymInfo from "@/components/gym/GymInfo";
import GymActionSide from "@/components/gym/GymActionSide";

export default function GymDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. 히어로 영역 */}
      <GymHero name="더클라임 강남점" address="서울 강남구 테헤란로 123" />

      {/* 2. 메인 콘텐츠 영역 */}
      <main className="max-w-7xl mx-auto w-full px-6 md:px-16 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <GymInfo />
        <GymActionSide />
      </main>
    </div>
  );
}
