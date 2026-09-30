import Navbar from "@/components/layout/Navbar";
import "./globals.css";
import localFont from "next/font/local";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "오르리 | 오늘 어디서 오를까?", template: "%s | 오르리" },
  description: "지역과 현재 위치로 클라이밍 암장을 찾아보는 오르리 체험 서비스입니다.",
};

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard-local",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="flex flex-col min-h-screen bg-white font-pretendard antialiased text-gray-900">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:p-3">본문 바로가기</a>
        <Navbar />
        <p className="bg-main-light px-6 py-2 text-center text-xs text-main-dark">체험용 서비스 · 암장 정보·사진·평점·저장 수는 예시 데이터입니다.</p>
        {/* 페이지별 본문 콘텐츠 */}
        <main id="main-content" tabIndex={-1} className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
