"use client";
import { useSaved } from "./SavedProvider";
import { useState } from "react";

export default function SaveButton({ id, name }: { id: string; name: string }) {
  const { ids, ready, error, store } = useSaved();
  const [localError, setLocalError] = useState("");
  const saved = ids.includes(id);
  return <div><button type="button" disabled={!ready} aria-pressed={saved}
    aria-label={`${name} 기기 저장 ${saved ? "해제" : "하기"}`} onClick={() => { store.toggle(id); setLocalError(store.getSnapshot().error); }}
    className={`w-full rounded-xl border px-3 py-3 text-sm font-bold disabled:opacity-50 ${saved ? "border-main-dark bg-main-light text-main-dark" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
    {!ready ? "저장 확인 중..." : saved ? "✓ 이 기기에 저장됨 · 해제" : "이 기기에 저장"}
  </button>{error && localError && <p role="alert" className="mt-2 text-sm text-red-700">{localError}</p>}</div>;
}
