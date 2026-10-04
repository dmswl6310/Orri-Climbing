"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">정보를 불러오지 못했어요</h1>
      <p role="alert" className="mt-4 text-gray-600">잠시 후 다시 시도해주세요. 문제가 계속되면 홈에서 다시 검색할 수 있습니다.</p>
      <div className="mt-6 flex justify-center gap-4">
        <button type="button" onClick={reset} className="rounded-xl bg-main-dark px-5 py-3 text-white">다시 시도</button>
        <Link href="/" className="rounded-xl border border-gray-200 px-5 py-3">홈으로</Link>
      </div>
    </section>
  );
}
