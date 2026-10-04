"use client";
import { useSaved } from "./SavedProvider";

export default function SavedNotice() {
  const { ids, ready, error, store } = useSaved();
  return <>
    <p role="status" className="sr-only">{ready ? `이 기기에 저장한 암장 ${ids.length}개` : "기기 저장 목록 확인 중"}</p>
    {error && <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-900">
      <p role="alert">{error}</p>
      <button onClick={store.refresh} className="mt-2 underline font-bold">저장 목록 다시 읽기</button>
    </div>}
  </>;
}
