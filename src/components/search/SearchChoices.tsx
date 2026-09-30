"use client";

import { useId, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { buildSearchHref, FACILITY_KEYS, FACILITY_LABELS, normalizeSearch, readSearchParams, type SearchParams } from "@/utils/search";
import { cancelLocationSearch } from "@/hooks/useLocationSearch";

export default function SearchChoices() {
  const params = useSearchParams();
  return <ChoiceForm key={params.toString()} params={readSearchParams(params)} />;
}

function ChoiceForm({ params }: { params: SearchParams }) {
  const router = useRouter();
  const id = useId();
  const applied = normalizeSearch(params).filters;
  const [budget, setBudget] = useState(applied.maxPrice?.toString() ?? "");
  const [choices, setChoices] = useState(applied);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const flags = [...FACILITY_KEYS, "beginner" as const];
  const labels = { ...FACILITY_LABELS, beginner: "초보자 체험 강습" };
  const resetHref = buildSearchHref(params, { maxPrice: undefined, parking: undefined, shower: undefined, rental: undefined, beginner: undefined });
  const active = [
    ...(applied.maxPrice !== undefined ? [{ key: "maxPrice" as const, label: `일일권 ${applied.maxPrice.toLocaleString("ko-KR")}원 이하` }] : []),
    ...flags.filter((key) => applied[key]).map((key) => ({ key, label: labels[key] })),
  ];
  function navigate(href: string) {
    cancelLocationSearch();
    startTransition(() => router.push(href, { scroll: false }));
  }
  function resetDraft() {
    setBudget("");
    setChoices(normalizeSearch({}).filters);
    setError("");
  }

  return (
    <section aria-label="방문 조건 필터" className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
      <form noValidate onSubmit={(event) => {
        event.preventDefault();
        if (budget && (!/^\d{1,7}$/.test(budget) || Number(budget) > 1000000)) {
          setError("가격은 0~1,000,000원 사이의 정수로 입력해주세요.");
          document.getElementById(id)?.focus();
          return;
        }
        setError("");
        navigate(buildSearchHref(params, {
          maxPrice: budget || undefined,
          ...Object.fromEntries(flags.map((key) => [key, choices[key] ? "1" : undefined])),
        }));
      }}>
        <fieldset disabled={pending} className="space-y-4">
          <legend className="text-lg font-bold mb-3">내게 맞는 암장 찾기</legend>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div>
              <label htmlFor={id} className="block text-sm font-semibold mb-2">일일 이용권 최대 가격</label>
              <div className="flex items-center gap-2">
                <input id={id} type="text" inputMode="numeric" value={budget}
                  onChange={(event) => { setBudget(event.target.value); setError(""); }}
                  aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : `${id}-hint`}
                  placeholder="제한 없음" maxLength={8}
                  className="w-40 max-w-full rounded-lg border border-gray-300 px-3 py-2" />
                <span className="text-sm">원 이하</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              {flags.map((key) => <label key={key} className="flex items-center gap-2 py-1 text-sm">
                <input type="checkbox" checked={choices[key]} onChange={(event) => setChoices({ ...choices, [key]: event.target.checked })}
                  className="h-4 w-4 accent-blue-800" />{labels[key]}
              </label>)}
            </div>
          </div>
          <p id={`${id}-hint`} className="text-xs leading-relaxed text-gray-600">선택한 조건을 모두 충족하고 정보가 등록된 암장만 표시합니다. 정보 없음은 불가와 다릅니다.</p>
          {error && <p id={`${id}-error`} role="alert" className="text-sm text-red-700">{error}</p>}
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="rounded-xl bg-main-dark px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{pending ? "적용 중..." : "조건 적용"}</button>
            <Link href={resetHref} onClick={resetDraft} scroll={false} className="text-sm underline underline-offset-4">필터 초기화</Link>
            <Link href="/search" onClick={resetDraft} className="text-sm text-gray-600 underline underline-offset-4">전체 초기화</Link>
          </div>
        </fieldset>
      </form>
      {active.length > 0 && <div className="mt-4 border-t border-gray-100 pt-4">
        <p className="text-xs font-semibold text-gray-600 mb-2">적용 중인 조건</p>
        <ul className="flex flex-wrap gap-2">{active.map(({ key, label }) => <li key={key}>
          <button type="button" disabled={pending} onClick={() => navigate(buildSearchHref(params, { [key]: undefined }))}
            aria-label={`${label} 조건 해제`} className="rounded-full bg-main-light px-3 py-2 text-xs text-main-dark">
            {label} <span aria-hidden="true">×</span>
          </button>
        </li>)}</ul>
      </div>}
      <p role="status" className="sr-only">{pending ? "조건에 맞는 암장을 찾고 있습니다." : ""}</p>
    </section>
  );
}
