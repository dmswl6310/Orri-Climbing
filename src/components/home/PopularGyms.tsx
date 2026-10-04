import Link from "next/link";
import GymCard from "./GymCard";
import { getFeaturedGyms } from "@/services/gymService";
import { GymDetail } from "@/types/gyms/types";

const PopularGyms = async () => {
  const gyms = await getFeaturedGyms(3);

  return (
    <section className="p-8 md:p-16 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="font-bold text-gray-900 text-2xl md:text-3xl tracking-tight mb-2">
            둘러볼 암장
          </h2>
          <p className="text-gray-400 text-sm font-medium">
            데모에 지정된 순서입니다. 실제 인기 순위가 아닙니다.
          </p>
        </div>

        <Link href="/search" className="text-xs md:text-sm font-bold text-main-dark bg-main-light/30 px-5 py-2.5 rounded-full hover:bg-main-light/50 transition-all border border-main-light/20 whitespace-nowrap">
            전체보기 →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gyms.map((gym: GymDetail) => (
          <GymCard key={gym.id} {...gym} />
        ))}
      </div>
    </section>
  );
};

export default PopularGyms;
