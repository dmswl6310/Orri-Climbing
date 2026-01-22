const GymHero = ({ name, address }: { name: string; address: string }) => (
  <section className="relative h-[300px] md:h-[450px] bg-gray-100">
    <div className="w-full h-full bg-slate-200" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
    <div className="absolute bottom-8 px-6 md:px-16 w-full max-w-7xl mx-auto left-1/2 -translate-x-1/2">
      <div className="flex gap-2 mb-3">
        <span className="bg-main text-white text-[10px] px-2 py-1 rounded font-bold uppercase">
          Bouldering
        </span>
      </div>
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{name}</h1>
      <p className="text-white/80 text-sm md:text-base flex items-center gap-2">
        📍 {address}
      </p>
    </div>
  </section>
);

export default GymHero;
