"use client";
import Link from "next/link";
import GymCard from "@/components/home/GymCard";
import type { GymCardData } from "@/types/gyms/types";
import { useSaved } from "./SavedProvider";

export default function SavedList({ gyms }: { gyms: GymCardData[] }) {
  const { ids, ready, error } = useSaved();
  if (!ready) return <p role="status" className="py-8">이 기기의 저장 목록을 확인하고 있습니다...</p>;
  const cards = ids.flatMap((id) => { const gym = gyms.find((item) => item.id === id); return gym ? [gym] : []; });
  return <>
    <p className="font-semibold text-main-dark mb-6">저장한 암장 {cards.length}개</p>
    {cards.length ? <section aria-label="이 기기에 저장한 암장" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((gym) => <GymCard key={gym.id} {...gym} />)}
    </section> : <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center space-y-4">
      <h2 className="text-xl font-bold">{error ? "저장 목록을 확인할 수 없어요" : "아직 저장한 암장이 없어요"}</h2>
      <p className="text-sm text-gray-600">{error ? "브라우저 저장소 설정을 확인하고 다시 시도해주세요." : "마음에 드는 암장에서 ‘이 기기에 저장’을 눌러보세요. 여기서 다시 찾아보고 비교할 수 있어요."}</p>
      <Link href="/search" className="inline-block rounded-xl bg-main-dark px-5 py-3 font-bold text-white">암장 찾아보기</Link>
    </div>}
  </>;
}
