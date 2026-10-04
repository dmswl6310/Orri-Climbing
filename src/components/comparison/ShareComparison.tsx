"use client";
import { useState } from "react";

export default function ShareComparison({ href, hasLocation }: { href: string; hasLocation: boolean }) {
  const [message, setMessage] = useState("");
  const [manual, setManual] = useState("");
  async function copy() {
    const url = new URL(href, window.location.origin).href;
    try { await navigator.clipboard.writeText(url); setMessage("비교 링크를 복사했습니다."); setManual(""); }
    catch { setManual(url); setMessage("자동 복사를 사용할 수 없습니다. 아래 링크를 직접 복사해주세요."); }
  }
  return <div className="space-y-2">
    <button onClick={copy} className="rounded-xl border border-main-dark px-4 py-3 font-bold text-main-dark">비교 링크 복사</button>
    {hasLocation && <p className="text-xs text-gray-600">이 링크에는 거리를 계산한 기준 위치 좌표가 포함됩니다.</p>}
    <p role="status" className="text-sm text-main-dark">{message}</p>
    {manual && <label className="block text-sm">공유할 비교 링크<input readOnly value={manual} onFocus={(event) => event.currentTarget.select()} className="mt-1 block w-full rounded border p-3" /></label>}
  </div>;
}
