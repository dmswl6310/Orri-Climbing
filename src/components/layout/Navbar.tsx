export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-50">
      <div className="max-w-6xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between">
        {/* 로고 */}
        <span className="text-xl md:text-2xl font-black tracking-tighter text-main-dark">
          ORURI
        </span>

        {/* 로그인/회원가입 버튼 영역 */}
        <div className="flex items-center gap-3 md:gap-5">
          <button className="text-xs md:text-sm font-bold text-gray-500 hover:text-main-dark transition-colors">
            로그인
          </button>
          <button className="text-[11px] md:text-xs font-bold bg-main-dark text-white px-4 py-1.5 md:px-5 md:py-2 rounded-full hover:brightness-110 transition-all">
            시작하기
          </button>
        </div>
      </div>
    </header>
  );
}
