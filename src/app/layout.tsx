import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// 1. 로컬 폰트 설정
const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard", // CSS에서 사용할 변수명
});

export const metadata: Metadata = {
  title: "오르리 (ORURI) | 클라이밍 암장 검색",
  description: "내 주변 암장 정보와 세팅 일정을 확인하세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="flex flex-col min-h-screen">
        {/* 공통 상단바: 추후 Navbar 컴포넌트로 분리 */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <span className="text-2xl font-black text-main">오르리</span>
            <div className="flex gap-4">
              {/* 여기에 로그인/회원가입 버튼 넣을것*/}
            </div>
          </div>
        </header>

        {/* 페이지별 본문 콘텐츠 */}
        <main className="flex-grow">{children}</main>

        {/* 공통 하단바 */}
        <footer className="bg-slate-50 py-12 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>© 2026 ORURI. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
