import type { DifficultySystem, GymPrice, OperatingHour } from "@/types/gyms/types";

interface GymInfoProps {
  description: string;
  hours: OperatingHour[];
  facilities: string[];
  prices?: GymPrice[];
  difficultySystem?: DifficultySystem;
}

export default function GymInfo({ description, hours, facilities, prices = [], difficultySystem }: GymInfoProps) {
  return (
    <div className="lg:col-span-2 space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">암장 소개</h2>
        <p className="text-gray-600 leading-relaxed">{description || "소개 정보가 아직 등록되지 않았습니다."}</p>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">⏰ 이용 시간</h2>
        {hours.length ? <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hours.map((item) => <div key={item.day} className="bg-gray-50 rounded-2xl p-5 flex flex-wrap justify-between gap-2">
            <dt className="font-bold text-gray-700">{item.day}</dt>
            <dd className={`font-bold ${item.isClosed ? "text-red-700" : "text-main-dark"}`}>{item.isClosed ? "휴무" : item.time}</dd>
          </div>)}
        </dl> : <p className="text-gray-600">운영 시간이 아직 등록되지 않았습니다.</p>}
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">🏢 편의 시설</h2>
        {facilities.length ? <ul className="flex flex-wrap gap-2">
          {facilities.map((facility) => <li key={facility} className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700">{facility}</li>)}
        </ul> : <p className="text-gray-600">편의 시설 정보가 아직 등록되지 않았습니다.</p>}
      </section>
      {difficultySystem && difficultySystem.levels.length > 0 && <section>
        <h2 className="text-2xl font-bold mb-4">난이도 안내</h2>
        <p className="mb-3 text-sm text-gray-600">{difficultySystem.type === "color" ? "암장 자체 색상 체계" : "V 등급 체계"} · 암장마다 체감 난이도가 다를 수 있습니다.</p>
        <ol className="flex flex-wrap gap-2">
          {difficultySystem.levels.map((level, index) => <li key={`${index}-${level}`} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">{level}</li>)}
        </ol>
      </section>}
      <section>
        <h2 className="text-2xl font-bold mb-4">💳 요금 안내</h2>
        {prices.length ? <div className="overflow-x-auto rounded-2xl border border-gray-200">
          <table className="w-full text-left">
            <caption className="sr-only">암장 이용 요금</caption>
            <thead className="bg-gray-50"><tr><th scope="col" className="p-4">구분</th><th scope="col" className="p-4 text-right">가격</th></tr></thead>
            <tbody>{prices.map((price) => <tr key={price.label} className="border-t border-gray-100">
              <th scope="row" className="p-4 font-medium">{price.label}</th>
              <td className="p-4 text-right">{price.amount.toLocaleString("ko-KR")}원</td>
            </tr>)}</tbody>
          </table>
        </div> : <p className="text-gray-600">요금 정보가 아직 등록되지 않았습니다. 방문 전 암장 공식 안내를 확인해주세요.</p>}
      </section>
    </div>
  );
}
