import Link from "next/link";
import GymCard, { Gym } from "./GymCard";
import { JSX } from "react/jsx-runtime";
async function getPopularGyms() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/gyms/popular`,
    {
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) return [];
  return res.json();
}

const PopularGyms = async () => {
  const gyms = await getPopularGyms();

  return (
    <section className="p-8 md:p-16 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h3 className="font-bold text-gray-900 text-2xl md:text-3xl tracking-tight mb-2">
            🔥 이번 주 인기 암장
          </h3>
          <p className="text-gray-400 text-sm font-medium">
            클라이머들이 가장 많이 확인한 암장들이에요
          </p>
        </div>

        <Link href="/search" passHref>
          <button className="text-xs md:text-sm font-bold text-main-dark bg-main-light/30 px-5 py-2.5 rounded-full hover:bg-main-light/50 transition-all border border-main-light/20">
            전체보기 →
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gyms.map((gym: JSX.IntrinsicAttributes & Gym) => (
          <GymCard key={gym.id} {...gym} />
        ))}
      </div>
    </section>
  );
};

export default PopularGyms;
