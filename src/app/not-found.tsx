import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">페이지를 찾을 수 없어요</h1>
      <p className="mt-4 text-gray-600">주소가 올바른지 확인하거나 다른 암장을 찾아보세요.</p>
      <Link href="/search" className="mt-6 inline-block rounded-xl bg-main-dark px-5 py-3 text-white">암장 검색으로 이동</Link>
    </section>
  );
}
