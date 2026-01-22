const PopularGyms = () => (
  <section className="p-8 md:p-16 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-8">
      <h3 className="font-bold text-gray-900 text-xl md:text-2xl tracking-tight">
        🔥 이번 주 인기 암장
      </h3>
      <button className="text-xs font-bold text-gray-400 border-b border-gray-200 pb-0.5">
        전체보기
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((item) => (
        <GymCard key={item} />
      ))}
    </div>
  </section>
);

const GymCard = () => (
  <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-main-light transition-all flex flex-col">
    <div className="relative aspect-[16/8] overflow-hidden bg-gray-50">
      <div className="w-full h-full bg-slate-100 group-hover:scale-105 transition-transform duration-700" />
    </div>
    <div className="p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-base text-gray-800">더클라임 강남점</h4>
        <span className="text-point font-black text-xs">★ 4.9</span>
      </div>
      <div className="flex gap-1.5">
        <span className="bg-main-light/50 text-main-dark text-[10px] px-2 py-0.5 rounded font-bold uppercase">
          Bouldering
        </span>
        <span className="bg-purple-light/20 text-purple-light text-[10px] px-2 py-0.5 rounded font-bold uppercase">
          Large
        </span>
      </div>
      <p className="text-gray-400 text-[11px] leading-snug line-clamp-1">
        세련된 인테리어와 다양한 난이도의 벽면을 경험하세요.
      </p>
      <button className="mt-2 w-full py-2 rounded-lg bg-gray-50 text-main-dark text-[11px] font-bold hover:bg-main-light transition-colors">
        상세보기
      </button>
    </div>
  </div>
);

export default PopularGyms;
