import Link from "next/link";
import type { GymDetail } from "@/types/gyms/types";
import GymImage from "@/components/common/GymImage";

type GymCardProps = Pick<GymDetail, "id" | "name" | "thumbnail" | "district" | "scrapCount" | "rating" | "tags"> & {
  distanceKm?: number;
};

export default function GymCard({ id, name, thumbnail, district, scrapCount = 0, rating = 0, tags = [], distanceKm }: GymCardProps) {
  return (
    <Link href={`/gyms/${id}`} className="block h-full">
      <article className="group h-full bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-main-dark transition-all flex flex-col hover:shadow-lg">
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-50">
          <GymImage src={thumbnail} alt={name}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700" />
          <span className="absolute top-3 left-3 bg-white/95 rounded px-2 py-1 text-main-dark text-xs font-bold">{district}</span>
        </div>
        <div className="p-4 flex flex-col gap-3 flex-1">
          <h3 className="font-bold text-base text-gray-900 line-clamp-2">{name}</h3>
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => <span key={tag} className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded">#{tag}</span>)}
          </div>
          {distanceKm !== undefined && Number.isFinite(distanceKm) &&
            <p className="text-sm font-semibold text-main-dark">직선거리 {distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`}</p>}
          <div className="mt-auto border-t border-gray-100 pt-3 flex flex-wrap justify-between gap-2 text-xs text-gray-600">
            <span>누적 저장 {scrapCount.toLocaleString("ko-KR")}회</span>
            <span aria-label={`평점 ${rating.toFixed(1)}점`}>★ {rating.toFixed(1)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
