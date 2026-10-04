import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100">
      <nav aria-label="주 메뉴" className="max-w-6xl mx-auto px-3 sm:px-6 h-14 md:h-16 flex gap-2 items-center justify-between">
        <Link href="/" aria-label="오르리 홈" className="text-xl md:text-2xl font-black tracking-tighter text-main-dark">ORURI</Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/saved" className="text-sm font-bold text-main-dark">기기 저장</Link>
          <Link href="/compare" className="text-sm font-bold text-main-dark">암장 비교</Link>
          <Link href="/search" className="text-sm font-bold bg-main-dark text-white px-3 py-2 rounded-full hover:brightness-110">둘러보기</Link>
        </div>
      </nav>
    </header>
  );
}
