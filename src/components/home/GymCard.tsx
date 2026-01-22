import Link from "next/link";
import EyeIcon from "../icons/EyeIcon";

const GymCard = ({ id }: { id: number }) => (
  <Link href={`/gyms/${id}`} className="block">
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-main-light transition-all flex flex-col hover:shadow-xl hover:shadow-main/5">
      <div className="relative aspect-[16/8] overflow-hidden bg-gray-50">
        <div className="w-full h-full bg-slate-100 group-hover:scale-105 transition-transform duration-700" />
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-base text-gray-800">더클라임 강남점</h4>

          <div className="flex items-center gap-1 text-gray-400">
            <EyeIcon className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-tight">1.2k</span>
          </div>
        </div>

        <div className="flex gap-1.5">
          <span className="bg-main-light/50 text-main-dark text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-tighter">
            Bouldering
          </span>
          <span className="text-point font-black text-xs ml-auto">★ 4.9</span>
        </div>

        <p className="text-gray-400 text-[11px] leading-snug line-clamp-1 border-t border-gray-50 pt-2 mt-1">
          이번 주에만 300명이 넘게 확인했어요!
        </p>
      </div>
    </div>
  </Link>
);

export default GymCard;
