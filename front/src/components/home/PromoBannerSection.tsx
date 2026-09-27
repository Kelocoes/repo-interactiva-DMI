export default function PromoBannerSection() {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-[#fbfbfb]">

      {/* Onda Vectorial de Fondo (Vector 296 - 197:336) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full max-w-[1920px] flex justify-center pointer-events-none opacity-90 -z-0">
        <img
          src="/figma/7e164ba8c0c859c2e25680c044e179b53fb2d6e1.svg"
          alt=""
          className="w-full h-auto min-w-[1600px]"
        />
      </div>

      <div className="max-w-[1728px] mx-auto px-6 md:px-28 relative z-10 min-h-[700px] md:min-h-[950px] flex items-center justify-center">

        {/* Globo de Diálogo Izquierdo (Group 30 - 193:763) */}
        <div className="absolute left-6 sm:left-16 lg:left-[16%] top-[12%] md:top-[20%] z-20 animate-bounce duration-1000">
          <div className="w-[240px] sm:w-[290px] md:w-[310px] h-auto min-h-[75px] md:h-[80px] bg-[#fbfbfb] rounded-[50px] shadow-[0px_4px_20px_0px_rgba(67,67,67,0.18)] border border-slate-100 flex items-center justify-center px-5 py-3">
            <p className="text-xs sm:text-sm md:text-[15px] font-medium text-[#171717] leading-snug text-center">
              Los mejores dulces del Valle los encuentras solo en Boca'o!!
            </p>
          </div>
        </div>

        {/* Imagen Central del Personaje (200:771) */}
        <div className="relative z-10 w-full max-w-[450px] md:max-w-[560px] lg:max-w-[600px] flex justify-center">
          <img
            src="/figma/3315ad1fb46e5b97cc0470b2e7e7334e4e6d8f44.png"
            alt="Experiencia Boca'o"
            className="w-full h-auto max-h-[700px] md:max-h-[850px] object-contain drop-shadow-2xl"
          />
        </div>

        {/* Globo de Diálogo Derecho (Group 73 - 197:343) */}
        <div className="absolute right-6 sm:right-16 lg:right-[16%] bottom-[10%] md:bottom-[18%] z-20 animate-bounce duration-1000 delay-300">
          <div className="w-[240px] sm:w-[290px] md:w-[310px] h-auto min-h-[75px] md:h-[80px] bg-[#fbfbfb] rounded-[50px] shadow-[0px_4px_20px_0px_rgba(67,67,67,0.18)] border border-slate-100 flex items-center justify-center px-5 py-3">
            <p className="text-xs sm:text-sm md:text-[15px] font-medium text-[#171717] leading-snug text-center">
              Todo en un solo lugar Boca'o lo mejor!!
            </p>
          </div>
        </div>

        {/* Elemento Decorativo Vectorial (Vector 200:775) */}
        <div className="absolute right-[14%] md:right-[22%] top-[50%] w-52 sm:w-72 md:w-[480px] pointer-events-none">
          <img
            src="/figma/54b8222684efaceb8dbb0c91c1e4949d032fc22d.svg"
            alt=""
            className="w-full h-auto transform -rotate-[35deg]"
          />
        </div>

      </div>
    </section>
  )
}