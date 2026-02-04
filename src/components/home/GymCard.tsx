import Link from "next/link";
import EyeIcon from "../icons/EyeIcon";
import { GymDetail } from "@/types/gyms/types";

const GymCard = ({
  id,
  name,
  thumbnail,
  district,
  scrapCount,
  rating,
  tags,
}: GymDetail) => (
  <Link href={`/gyms/${id}`} className="block">
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-main-light transition-all flex flex-col hover:shadow-xl hover:shadow-main/5">
      {/* 이미지 영역 */}
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-50">
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* 지역 뱃지 (이미지 위에 띄우면 더 세련되어 보입니다) */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm">
          <span className="text-main-dark text-[10px] font-bold">
            {district}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2.5">
        {/* 제목 및 조회수 */}
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-base text-gray-800 line-clamp-1 flex-1">
            {name}
          </h4>
          <div className="flex items-center gap-1 text-gray-400 mt-1 ml-2">
            <EyeIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-tight">1.2k</span>
          </div>
        </div>

        {/* 태그 영역 - 이번에 추가된 핵심 부분 */}
        <div className="flex flex-wrap gap-1">
          {tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-gray-50 text-gray-500 text-[10px] px-1.5 py-0.5 rounded font-medium border border-gray-100"
            >
              #{tag}
            </span>
          ))}
          {/* 태그가 많을 경우 대비 */}
          {tags && tags.length > 3 && (
            <span className="text-gray-300 text-[10px] font-medium self-center ml-0.5">
              ...
            </span>
          )}
        </div>

        {/* 하단 정보 레이아웃 정돈 */}
        <div className="flex justify-between items-center mt-1">
          <span className="bg-main-light/30 text-main-dark text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">
            Bouldering
          </span>
          <span className="text-point font-black text-xs">
            ★ {rating.toFixed(1)}
          </span>
        </div>

        <p className="text-gray-400 text-[11px] leading-snug line-clamp-1 border-t border-gray-50 pt-2.5 mt-1">
          이번 주에만{" "}
          <span className="text-main font-bold">
            {scrapCount.toLocaleString()}명
          </span>
          이 저장했어요!
        </p>
      </div>
    </div>
  </Link>
);

export default GymCard;
