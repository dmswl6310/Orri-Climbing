import Navbar from "@/components/layout/Navbar";
import "./globals.css";
import localFont from "next/font/local";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getSearchGymPool } from "@/services/gymService";
import ComparisonProvider from "@/components/comparison/ComparisonProvider";
import ComparisonTray from "@/components/comparison/ComparisonTray";
import SavedProvider from "@/components/saved/SavedProvider";
import SavedNotice from "@/components/saved/SavedNotice";

export const metadata: Metadata = {
  title: { default: "오르리 | 오늘 어디서 오를까?", template: "%s | 오르리" },
  description: "지역과 현재 위치로 클라이밍 암장을 찾아보는 오르리 체험 서비스입니다.",
};

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard-local",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const candidates = (await getSearchGymPool()).map(({ id, name }) => ({ id, name }));
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="flex flex-col min-h-screen bg-white font-pretendard antialiased text-gray-900">
        <ComparisonProvider candidates={candidates}>
        <SavedProvider ids={candidates.map(({ id }) => id)}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:p-3">본문 바로가기</a>
        <Navbar />
        <p className="bg-main-light px-6 py-2 text-center text-xs text-main-dark">포트폴리오 데모 · 암장 정보와 사진은 예시입니다. 로그인 없이 검색·비교·기기 저장을 체험하세요.</p>
        <SavedNotice />
        {/* 페이지별 본문 콘텐츠 */}
        <main id="main-content" tabIndex={-1} className="flex-grow">{children}</main>
        <Footer />
        <Suspense fallback={null}><ComparisonTray /></Suspense>
        </SavedProvider>
        </ComparisonProvider>
      </body>
    </html>
  );
}
