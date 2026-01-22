import MountainIcon from "../icons/MountainIcon";

const HeroSection = () => (
  <section className="relative bg-gradient-to-br from-main-light/40 to-white pt-16 pb-16 md:pt-20 md:pb-24 px-6 md:px-16 rounded-b-[40px] md:rounded-b-[80px] overflow-hidden">
    <div className="relative z-10 max-w-6xl mx-auto">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.15] tracking-tight mb-6">
        오늘, 어디서
        <br />
        <span className="relative inline-block mt-1">
          <span className="relative z-10 text-main">오를까?</span>
          <span className="absolute bottom-1 md:bottom-1.5 left-0 w-full h-2.5 md:h-4 bg-main-light/70 -z-10" />
        </span>
      </h1>
      <div className="flex items-center gap-2 mt-5 md:mt-7">
        <MountainIcon className="text-main-dark/50 w-5 h-5 md:w-6 md:h-6" />
        <p className="text-gray-400 text-sm md:text-lg font-medium leading-tight tracking-tight">
          지금 내 주변에서{" "}
          <span className="text-gray-600 font-bold">가장 가까운 암장</span>을
          찾아보세요
        </p>
      </div>
    </div>
    <div className="absolute bottom-4 right-8 md:right-28 w-36 md:w-64 lg:w-80 h-36 md:h-64 lg:h-80 bg-[url('/climbing-img.png')] bg-contain bg-right-bottom bg-no-repeat opacity-30 hidden sm:block pointer-events-none" />
  </section>
);

export default HeroSection;
