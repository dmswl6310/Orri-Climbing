interface GymHeroProps {
  name: string;
  address: string;
  thumbnail: string;
}

const GymHero = ({ name, address, thumbnail }: GymHeroProps) => (
  <section className="relative h-[300px] md:h-[450px] bg-gray-900 overflow-hidden">
    {/* 1. 배경 이미지: thumbnail이 있으면 보여주고, 없으면 기본색 노출 */}
    {thumbnail ? (
      <img
        src={thumbnail}
        alt={name}
        className="w-full h-full object-cover opacity-80" // 텍스트 가독성을 위해 살짝 어둡게
      />
    ) : (
      <div className="w-full h-full bg-slate-800" />
    )}

    {/* 2. 그라데이션 오버레이: 하단 텍스트를 더 선명하게 */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

    {/* 3. 콘텐츠 영역 */}
    <div className="absolute bottom-8 px-6 md:px-16 w-full max-w-7xl mx-auto left-1/2 -translate-x-1/2">
      <div className="flex gap-2 mb-3">
        <span className="bg-main text-white text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider">
          Bouldering
        </span>
        {/* 추가 제안: 뱃지 하나 더 있으면 예쁩니다 */}
        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded font-bold uppercase">
          Indoor Climbing
        </span>
      </div>

      <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">
        {name}
      </h1>

      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <p className="text-white/90 text-sm md:text-base flex items-center gap-1.5 font-medium">
          <span className="text-main-light">📍</span> {address}
        </p>
        <div className="hidden md:block w-1 h-1 rounded-full bg-white/30" />
        <p className="text-white/60 text-xs md:text-sm font-medium">
          서울시 암장 정보 제공 서비스
        </p>
      </div>
    </div>
  </section>
);

export default GymHero;
