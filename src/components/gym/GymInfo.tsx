// components/gym/GymInfo.tsx

const GymInfo = () => {
  return (
    <div className="lg:col-span-2 space-y-12">
      {/* 1. 암장 소개 */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">암장 소개</h3>
        <p className="text-gray-600 leading-relaxed text-base md:text-lg">
          국내 최대 규모의 볼더링 시설을 자랑하는 더클라임 강남점입니다. 매주
          새로운 문제가 세팅되며, 초보자부터 상급자까지 즐길 수 있는 다양한
          각도의 벽이 준비되어 있습니다. 쾌적한 환경에서 클라이밍을 즐겨보세요!
        </p>
      </section>

      {/* 2. 이용 시간 */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          ⏰ 이용 시간
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-2xl p-5 flex justify-between items-center border border-gray-100">
            <span className="font-bold text-gray-700">평일</span>
            <span className="text-main-dark font-black">10:00 - 23:00</span>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 flex justify-between items-center border border-gray-100">
            <span className="font-bold text-gray-700">주말 / 공휴일</span>
            <span className="text-main-dark font-black">10:00 - 20:00</span>
          </div>
        </div>
      </section>

      {/* 3. 요금 안내 */}
      <section>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          💳 요금 안내
        </h3>
        <div className="overflow-hidden rounded-3xl border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">
                  구분
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-right">
                  가격
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 font-bold text-gray-800 text-base">
                  일일 이용권
                </td>
                <td className="px-6 py-5 text-right font-black text-main-dark text-lg">
                  22,000원
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 font-bold text-gray-800 text-base">
                  일일 체험 강습 (예약 필수)
                </td>
                <td className="px-6 py-5 text-right font-black text-main-dark text-lg">
                  30,000원
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 font-bold text-gray-800 text-base">
                  10회 이용권 (6개월 이내)
                </td>
                <td className="px-6 py-5 text-right font-black text-main-dark text-lg">
                  190,000원
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-5 font-bold text-gray-800 text-base">
                  정기권 (1개월)
                </td>
                <td className="px-6 py-5 text-right font-black text-main-dark text-lg">
                  130,000원
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          * 신발 대여료(5,000원)는 별도입니다. 중고생 할인은 현장에서 증명서
          확인 후 적용 가능합니다.
        </p>
      </section>
    </div>
  );
};

export default GymInfo;
