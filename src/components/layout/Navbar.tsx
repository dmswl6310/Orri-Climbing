import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100">
      <nav aria-label="주 메뉴" className="max-w-6xl mx-auto px-6 h-14 md:h-16 flex items-center justify-between">
        <Link href="/" aria-label="오르리 홈" className="text-xl md:text-2xl font-black tracking-tighter text-main-dark">ORURI</Link>
        <Link href="/search" className="text-sm font-bold bg-main-dark text-white px-4 py-2 rounded-full hover:brightness-110">암장 둘러보기</Link>
      </nav>
    </header>
  );
}
