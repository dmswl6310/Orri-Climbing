export default function SearchFallback() {
  /* 1. 검색 결과가 없을 때 (Fallback 영역) */
  return (
    <section className="mb-8">
      <div className="p-10 bg-white shadow-sm border border-gray-100 rounded-3xl text-center mb-10">
        <span className="text-5xl mb-4 block">🧗</span>
        <h2 className="text-2xl font-bold text-gray-800">검색 결과가 없어요</h2>
        <p className="text-gray-500 mt-2">
          검색어나 방문 조건을 변경해주세요. 아래는 현재 조건과 무관한 추천 암장입니다.
        </p>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          다른 암장 둘러보기
        </h2>
      </div>
    </section>
  );
}
