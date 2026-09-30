"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useComparison } from "./ComparisonProvider";
import { buildCompareHref } from "@/utils/comparison";
import { readSearchParams } from "@/utils/search";

export default function ComparisonTray() {
  const { ids, store, candidates, persistent } = useComparison();
  const params = useSearchParams();
  const pathname = usePathname();
  if (pathname === "/compare") return null;
  return <>
    <p className="sr-only" role="status">{ids.length ? `비교 후보 ${ids.length}개 선택됨. 최대 3개까지 선택할 수 있습니다.` : "비교 후보가 없습니다."}</p>
    {ids.length > 0 && <>
      <div className="h-[45dvh]" aria-hidden="true" />
      <aside aria-label="비교 후보" className="fixed inset-x-0 bottom-0 z-40 max-h-[45dvh] overflow-y-auto border-t border-main bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg">
        <div className="max-w-6xl mx-auto space-y-2">
          <div className="flex items-center justify-between gap-2"><p className="font-bold">비교 후보 {ids.length}/3</p><button onClick={store.clear} className="text-sm underline p-2">모두 비우기</button></div>
          <ul className="flex flex-wrap gap-2">{ids.map((id) => {
            const name = candidates.find((gym) => gym.id === id)?.name ?? id;
            return <li key={id}><button onClick={() => store.remove(id)} aria-label={`${name} 후보에서 제거`} className="rounded-full bg-main-light px-3 py-2 text-xs text-main-dark">{name} ×</button></li>;
          })}</ul>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-gray-600">{persistent ? "이 탭에서 새로고침해도 후보가 유지됩니다." : "저장소를 사용할 수 없어 새로고침하면 후보가 초기화됩니다."}</p>
            {ids.length >= 2 ? <Link href={buildCompareHref(ids, readSearchParams(params))} className="rounded-xl bg-main-dark px-4 py-3 text-sm font-bold text-white">{ids.length}개 암장 비교하기</Link> : <p className="text-sm text-main-dark">암장을 1개 더 선택해주세요.</p>}
          </div>
        </div>
      </aside>
    </>}
  </>;
}
