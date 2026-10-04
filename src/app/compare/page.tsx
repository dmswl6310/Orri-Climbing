import type { Metadata } from "next";
import Link from "next/link";
import { getGymById } from "@/services/gymService";
import { buildCompareHref, parseCompareIds } from "@/utils/comparison";
import { normalizeSearch, FACILITY_KEYS, FACILITY_LABELS, type SearchParams } from "@/utils/search";
import { availabilityLabel, formatDistance, getDailyPrice, getFacilityStatus } from "@/utils/gymFacts";
import { getDistance } from "@/utils.math";
import type { GymDetail } from "@/types/gyms/types";
import GymImage from "@/components/common/GymImage";
import SavedComparison from "@/components/comparison/SavedComparison";
import ShareComparison from "@/components/comparison/ShareComparison";

export const metadata: Metadata = { title: "암장 비교", description: "가격, 거리, 운영 시간과 편의시설을 비교해 나에게 맞는 암장을 골라보세요." };
type CompareParams = SearchParams & { ids?: string | string[] };

export default async function ComparePage({ searchParams }: { searchParams: Promise<CompareParams> }) {
  const params = await searchParams;
  const parsed = parseCompareIds(params.ids);
  const resolved = await Promise.all(parsed.ids.map(getGymById));
  const gyms = resolved.filter((gym): gym is GymDetail => gym !== null);
  const ids = gyms.map(({ id }) => id);
  const { coordinates, invalidCoordinates } = normalizeSearch(params);
  const rows: { label: string; value: (gym: GymDetail) => React.ReactNode }[] = [
    { label: "일일권 최저가", value: (gym) => { const price = getDailyPrice(gym); return price === undefined ? "정보 없음" : `${price.toLocaleString("ko-KR")}원`; } },
    { label: "직선거리", value: (gym) => formatDistance(coordinates ? getDistance(coordinates.lat, coordinates.lon, gym.lat, gym.lon) : undefined) },
    { label: "주소", value: (gym) => gym.address || "정보 없음" },
    { label: "운영 시간", value: (gym) => gym.hours.length ? <ul className="space-y-1">{gym.hours.map((hour, index) => <li key={index}>{hour.day} · {hour.isClosed ? "휴무" : hour.time || "정보 없음"}</li>)}</ul> : "정보 없음" },
    ...FACILITY_KEYS.map((key) => ({ label: FACILITY_LABELS[key], value: (gym: GymDetail) => availabilityLabel(getFacilityStatus(gym, key)) })),
    { label: "초보자 체험 강습", value: (gym) => availabilityLabel(gym.beginnerLesson) },
    { label: "난이도 체계", value: (gym) => gym.difficultySystem.levels.length ? `${gym.difficultySystem.type === "color" ? "색상" : "V등급"} · ${gym.difficultySystem.levels.join(" / ")}` : "정보 없음" },
  ];
  return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-3xl font-black">암장 비교</h1><p className="mt-2 text-gray-600">내가 중요하게 생각하는 조건을 나란히 살펴보세요.</p></div>
      <Link href="/search" className="text-main-dark underline py-2">다른 암장 찾기</Link>
    </div>
    {(parsed.invalid || resolved.some((gym) => !gym)) && <p role="status" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">일부 비교 대상이 올바르지 않거나 삭제되었습니다. 유효한 암장을 최대 3개까지 표시합니다.</p>}
    {invalidCoordinates && <p role="status" className="text-sm text-amber-900">위치 정보가 올바르지 않아 거리를 표시하지 않았습니다.</p>}
    {gyms.length < 2 && <><p className="font-semibold">비교하려면 암장이 2개 이상 필요해요.</p><SavedComparison /></>}
    {gyms.length > 0 && <>
      <p id="comparison-help" className="text-sm text-gray-600">정보 없음은 제공 여부를 확인하지 못한 항목입니다. {coordinates ? "거리는 기준 위치로부터의 직선거리입니다." : "검색에서 내 위치를 설정한 뒤 비교하면 거리도 볼 수 있어요."} 작은 화면에서는 표를 좌우로 스크롤할 수 있습니다.</p>
      <div role="region" aria-label="암장 비교표" aria-describedby="comparison-help" tabIndex={0} className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full table-fixed text-sm" style={{ minWidth: 140 + gyms.length * 220 }}>
          <caption className="sr-only">{gyms.map(({ name }) => name).join(", ")} 조건 비교</caption>
          <thead><tr><th scope="col" className="w-36 p-4 text-left bg-gray-50">비교 항목</th>{gyms.map((gym) => <th scope="col" key={gym.id} className="p-4 text-left align-top border-l border-gray-200">
            <div className="relative aspect-video rounded-xl overflow-hidden mb-3"><GymImage src={gym.thumbnail} alt={gym.name} sizes="240px" className="object-cover" /></div>
            <Link className="font-bold text-main-dark underline" href={`/gyms/${gym.id}`}>{gym.name}</Link>
            {gym.isDemo && <p className="mt-2 text-xs font-normal text-purple-800">가상 데모 · 실제 영업 정보 아님</p>}
            <Link href={buildCompareHref(ids.filter((id) => id !== gym.id), params)} aria-label={`${gym.name} 비교표에서 제거`} className="mt-3 inline-block text-xs font-normal underline">표에서 제거</Link>
          </th>)}</tr></thead>
          <tbody>{rows.map((row) => <tr key={row.label} className="border-t border-gray-200"><th scope="row" className="bg-gray-50 p-4 text-left font-semibold">{row.label}</th>{gyms.map((gym) => <td key={gym.id} className="p-4 align-top border-l border-gray-200 break-words">{row.value(gym)}</td>)}</tr>)}</tbody>
        </table>
      </div>
      {gyms.length >= 2 && <ShareComparison href={buildCompareHref(ids, params)} hasLocation={!!coordinates} />}
      <p className="text-xs text-gray-600">현재 데이터는 체험용입니다. 실제 가격·시설·운영 시간은 방문 전 공식 안내를 확인해주세요. 비교표에서 제거해도 저장된 후보는 유지됩니다.</p>
    </>}
  </div>;
}
