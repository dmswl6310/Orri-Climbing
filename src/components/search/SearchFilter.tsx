"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { cancelLocationSearch, useLocationSearch } from "@/hooks/useLocationSearch";
import { normalizeSearch, type SearchSort } from "@/utils/search";

export default function SearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const values = (key: string) => {
    const values = searchParams.getAll(key);
    return values.length > 1 ? values : values[0];
  };
  const { q, coordinates, sort } = normalizeSearch({ q: values("q"), lat: values("lat"), lon: values("lon"), sort: values("sort") });
  const { isLoading, error, handleLocationSearch } = useLocationSearch(q);
  const [isPending, startTransition] = useTransition();

  const handleSort = (nextSort: SearchSort) => {
    if (nextSort === "distance" && !coordinates) {
      handleLocationSearch();
      return;
    }
    const params = new URLSearchParams({ sort: nextSort });
    cancelLocationSearch();
    if (q) params.set("q", q);
    if (coordinates) {
      params.set("lat", String(coordinates.lat));
      params.set("lon", String(coordinates.lon));
    }
    startTransition(() => router.push(`/search?${params}`));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2" aria-label="검색 결과 정렬">
        {(["distance", "popular"] as const).map((value) => (
          <button key={value} type="button" onClick={() => handleSort(value)}
            aria-pressed={sort === value} disabled={isLoading || isPending}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all disabled:opacity-50 ${sort === value ? "bg-slate-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
            {value === "distance" ? isLoading ? "위치 찾는 중..." : "📍 거리순" : "🔥 인기순"}
          </button>
        ))}
      </div>
      {error && <p role="alert" className="mt-2 max-w-sm text-sm text-red-700">{error}</p>}
    </div>
  );
}
