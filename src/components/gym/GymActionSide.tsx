import Link from "next/link";
import CompareButton from "@/components/comparison/CompareButton";

interface GymActionSideProps {
  id: string;
  name: string;
  rating: number;
  scrapCount: number;
}

export default function GymActionSide({ id, name, rating, scrapCount }: GymActionSideProps) {
  return (
    <aside className="lg:sticky lg:top-24 self-start border border-gray-200 rounded-3xl p-6 space-y-5">
      <h2 className="font-bold text-lg">암장 정보</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between"><dt>누적 저장</dt><dd>{scrapCount.toLocaleString("ko-KR")}회</dd></div>
        <div className="flex justify-between"><dt>평점</dt><dd>★ {rating.toFixed(1)}</dd></div>
      </dl>
      <p className="text-sm leading-relaxed text-gray-600">현재는 체험용 정보입니다. 실제 요금과 운영 시간은 방문 전 암장 공식 안내를 확인해주세요.</p>
      <Link href="/search" className="block rounded-xl bg-main-dark px-4 py-3 text-center font-bold text-white hover:brightness-110">다른 암장 찾아보기</Link>
      <CompareButton id={id} name={name} />
    </aside>
  );
}
