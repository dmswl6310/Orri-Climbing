import EyeIcon from "@/components/icons/EyeIcon";

interface GymActionSideProps {
  rating: number;
  scrapCount: number;
}

const GymActionSide = ({ rating, scrapCount }: GymActionSideProps) => (
  <div className="space-y-6">
    <div className="border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6 bg-white sticky top-24 transition-all hover:shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-gray-400">
          <EyeIcon className="w-4 h-4" />
          <span className="text-xs font-bold">
            {scrapCount.toLocaleString()} saves
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-yellow-400">★</span>
          <span className="text-point font-black text-xl">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <button className="w-full py-4 bg-main-dark text-white rounded-2xl font-bold hover:bg-black transition-colors">
          시설 이용 상담하기
        </button>
        <button className="w-full py-4 border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-colors">
          위치 저장하기
        </button>
      </div>

      <p className="text-center text-[10px] text-gray-300">
        정보가 다른가요?{" "}
        <span className="underline cursor-pointer">수정 요청하기</span>
      </p>
    </div>
  </div>
);

export default GymActionSide;
