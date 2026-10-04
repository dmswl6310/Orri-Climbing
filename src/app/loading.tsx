export default function Loading() {
  return (
    <div role="status" className="mx-auto max-w-7xl px-6 py-12">
      <p className="mb-6 font-semibold text-main-dark">암장 정보를 불러오는 중입니다...</p>
      <div aria-hidden="true" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => <div key={item} className="h-72 rounded-2xl bg-gray-100 motion-safe:animate-pulse" />)}
      </div>
    </div>
  );
}
