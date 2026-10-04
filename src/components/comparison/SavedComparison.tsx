"use client";
import Link from "next/link";
import { useComparison } from "./ComparisonProvider";
import { buildCompareHref } from "@/utils/comparison";

export default function SavedComparison() {
  const { ids } = useComparison();
  return <div className="rounded-2xl bg-main-light p-6 space-y-4">
    <p>검색 결과나 상세 화면에서 암장을 2~3개 선택하면 한눈에 비교할 수 있어요.</p>
    <div className="flex flex-wrap gap-4">
      <Link href="/search" className="font-bold text-main-dark underline">암장 고르러 가기</Link>
      {ids.length >= 2 && <Link href={buildCompareHref(ids)} className="font-bold text-main-dark underline">선택해둔 {ids.length}개 비교하기</Link>}
    </div>
  </div>;
}
