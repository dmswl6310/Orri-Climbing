import Navbar from "@/components/layout/Navbar";
import "./globals.css";
import localFont from "next/font/local";
import Footer from "@/components/layout/Footer";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className="flex flex-col min-h-screen bg-white font-pretendard antialiased text-gray-900">
        <Navbar />
        {/* 페이지별 본문 콘텐츠 */}
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
