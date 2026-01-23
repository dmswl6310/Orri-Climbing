export default function Footer() {
  return (
    <footer className="bg-gray-50 py-12 md:py-16 border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
        {/*로고 */}
        <div className="mb-6 opacity-30 group">
          <span className="text-xl md:text-2xl font-black tracking-tighter text-gray-400 group-hover:text-main transition-colors duration-500">
            ORURI
          </span>
        </div>

        {/* 카피라이트 문구*/}
        <div className="text-center space-y-2">
          <p className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">
            © 2026 <span className="text-gray-600">ORURI</span>. All rights
            reserved.
          </p>
          <p className="text-[9px] md:text-[10px] text-gray-300 font-medium">
            Designed for the next generation of climbers.
          </p>
        </div>

        {/* 미세 선 */}
        <div className="mt-8 w-12 h-[1px] bg-gray-200"></div>
      </div>
    </footer>
  );
}
