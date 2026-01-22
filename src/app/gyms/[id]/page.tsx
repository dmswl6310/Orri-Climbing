import EyeIcon from "@/components/icons/EyeIcon";
import MountainIcon from "@/components/icons/MountainIcon";

export default function GymDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. 상단 이미지 히어로 섹션 */}
      <section className="relative h-[300px] md:h-[450px] bg-gray-100">
        <div className="w-full h-full bg-slate-200" />{" "}
        {/* 실제 이미지 들어갈 자리 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 px-6 md:px-16 w-full max-w-7xl mx-auto left-1/2 -translate-x-1/2">
          <div className="flex gap-2 mb-3">
            <span className="bg-main text-white text-[10px] px-2 py-1 rounded font-bold uppercase">
              Bouldering
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded font-bold uppercase">
              Large
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            더클라임 강남점
          </h1>
          <p className="text-white/80 text-sm md:text-base flex items-center gap-2">
            📍 서울 강남구 테헤란로 123 (역삼동)
          </p>
        </div>
      </section>

      {/* 2. 상세 정보 영역 */}
      <main className="max-w-7xl mx-auto w-full px-6 md:px-16 py-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* 좌측: 메인 정보 (2/3 차지) */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">암장 소개</h3>
            <p className="text-gray-600 leading-relaxed">
              국내 최대 규모의 볼더링 시설을 자랑하는 더클라임 강남점입니다.
              매주 새로운 문제가 세팅되며, 초보자부터 상급자까지 즐길 수 있는
              다양한 각도의 벽이 준비되어 있습니다.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">이용 안내</h3>
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4 text-sm md:text-base">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">평일</span>
                <span className="font-bold text-gray-800">10:00 - 23:00</span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <span className="text-gray-500">주말/공휴일</span>
                <span className="font-bold text-gray-800">10:00 - 20:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">일일 이용권</span>
                <span className="font-bold text-main-dark font-black">
                  22,000원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 우측: 요약 및 액션바 (1/3 차지, PC에서 고정 가능) */}
        <div className="space-y-6">
          <div className="border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6 bg-white sticky top-24">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-gray-400">
                <EyeIcon className="w-4 h-4" />
                <span className="text-xs font-bold">이번 주 1.2k 클릭</span>
              </div>
              <span className="text-point font-black text-xl">★ 4.9</span>
            </div>

            <button className="w-full py-4 bg-main-dark text-white rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg shadow-main-dark/10">
              시설 이용 상담하기
            </button>
            <button className="w-full py-4 border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all">
              위치 저장하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
