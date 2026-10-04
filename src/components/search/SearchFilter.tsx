"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cancelLocationSearch, useLocationSearch } from "@/hooks/useLocationSearch";
import { buildSearchHref, normalizeSearch, readSearchParams, type SearchSort } from "@/utils/search";

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const context = readSearchParams(searchParams);
  const { q, coordinates, sort } = normalizeSearch(context);
  const { isLoading, error, handleLocationSearch } = useLocationSearch(q, context);
  const [isPending, startTransition] = useTransition();

  const handleSort = (nextSort: SearchSort) => {
    if (nextSort === "distance" && !coordinates) {
      handleLocationSearch();
      return;
    }
    cancelLocationSearch();
    startTransition(() => router.push(buildSearchHref(context, { sort: nextSort })));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2" aria-label="검색 결과 정렬">
        {(["distance", "popular"] as const).map((value) => (
          <button key={value} type="button" onClick={() => handleSort(value)}
            aria-pressed={sort === value} disabled={isLoading || isPending}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all disabled:opacity-50 ${sort === value ? "bg-slate-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
            {value === "distance" ? isLoading ? "위치 찾는 중..." : "📍 거리순" : "기본순"}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-600">기본순은 데모에 지정된 순서이며, 실제 인기 순위가 아닙니다.</p>
      {error && <p role="alert" className="mt-2 max-w-sm text-sm text-red-700">{error}</p>}
    </div>
  );
}
