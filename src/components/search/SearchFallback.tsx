export default function SearchFallback() {
  /* 1. 검색 결과가 없을 때 (Fallback 영역) */
  return (
    <section className="mb-8">
      <div className="p-10 bg-white shadow-sm border border-gray-100 rounded-3xl text-center mb-10">
        <span className="text-5xl mb-4 block">🧗</span>
        <h2 className="text-2xl font-bold text-gray-800">검색 결과가 없어요</h2>
        <p className="text-gray-500 mt-2">
          입력하신 검색어를 확인하시거나, 요즘 인기 있는 암장을 구경해 보세요!
        </p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          🔥 요즘 뜨는 인기 암장
        </h3>
      </div>
    </section>
  );
}
