import EyeIcon from "@/components/icons/EyeIcon";

const GymActionSide = () => (
  <div className="space-y-6">
    <div className="border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6 bg-white sticky top-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 text-gray-400">
          <EyeIcon className="w-4 h-4" />
          <span className="text-xs font-bold">1.2k views</span>
        </div>
        <span className="text-point font-black text-xl">★ 4.9</span>
      </div>
      <button className="w-full py-4 bg-main-dark text-white rounded-2xl font-bold">
        시설 이용 상담하기
      </button>
      <button className="w-full py-4 border border-gray-200 text-gray-600 rounded-2xl font-bold">
        위치 저장하기
      </button>
    </div>
  </div>
);

export default GymActionSide;
