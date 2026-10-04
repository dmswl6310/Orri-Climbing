"use client";

import { useComparison } from "./ComparisonProvider";
import { COMPARISON_LIMIT } from "@/utils/comparison";

export default function CompareButton({ id, name }: { id: string; name: string }) {
  const { ids, store } = useComparison();
  const selected = ids.includes(id);
  const full = !selected && ids.length >= COMPARISON_LIMIT;
  return <button type="button" aria-label={`${name} 비교 ${selected ? "해제" : "선택"}`} aria-pressed={selected}
    disabled={full} onClick={() => store.toggle(id)}
    className={`w-full rounded-xl border px-3 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${selected ? "bg-main-dark text-white border-main-dark" : "border-main-dark text-main-dark hover:bg-main-light"}`}>
    {selected ? "✓ 비교 선택됨 · 해제" : full ? "최대 3개 선택됨" : "+ 비교에 담기"}
  </button>;
}
