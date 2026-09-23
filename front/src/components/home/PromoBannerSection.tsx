export default function PromoBannerSection() {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-[#fbfbfb]">
      
      {/* Onda Vectorial de Fondo (Vector 296 - 197:336) */}
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-full max-w-[1920px] pointer-events-none opacity-90 -z-0">
        <img
          src="/figma/7e164ba8c0c859c2e25680c044e179b53fb2d6e1.svg"
          alt=""
          className="w-full h-auto min-w-[1200px]"
        />
      </div>

      <div className="max-w-[1728px] mx-auto px-6 md:px-28 relative z-10 min-h-[700px] md:min-h-[950px] flex items-center justify-center">
        
        {/* Globo de Diálogo Izquierdo (Group 30 - 193:763) */}
        <div className="absolute left-4 sm:left-12 lg:left-[10%] top-[12%] md:top-[20%] z-20 animate-bounce duration-1000">
          <div className="w-[280px] sm:w-[340px] md:w-[360px] h-auto min-h-[85px] md:h-[90px] bg-[#fbfbfb] rounded-[50px] shadow-[0px_4px_20px_0px_rgba(67,67,67,0.18)] border border-slate-100 flex items-center justify-center px-6 py-4">
            <p className="text-sm sm:text-base md:text-[20px] font-medium text-[#171717] leading-snug text-center">
              Los mejores dulces del Valle los encuentras solo en Boca’o!!
            </p>
          </div>
        </div>

        {/* Imagen Central del Personaje (200:771) */}
        <div className="relative z-10 w-full max-w-[550px] md:max-w-[680px] lg:max-w-[736px] flex justify-center">
          <img
            src="/figma/3315ad1fb46e5b97cc0470b2e7e7334e4e6d8f44.png"
            alt="Experiencia Boca'o"
            className="w-full h-auto max-h-[850px] md:max-h-[1050px] object-contain drop-shadow-2xl"
          />
        </div>

        {/* Globo de Diálogo Derecho (Group 73 - 197:343) */}
        <div className="absolute right-4 sm:right-12 lg:right-[12%] bottom-[10%] md:bottom-[18%] z-20 animate-bounce duration-1000 delay-300">
          <div className="w-[280px] sm:w-[340px] md:w-[360px] h-auto min-h-[85px] md:h-[90px] bg-[#fbfbfb] rounded-[50px] shadow-[0px_4px_20px_0px_rgba(67,67,67,0.18)] border border-slate-100 flex items-center justify-center px-6 py-4">
            <p className="text-sm sm:text-base md:text-[20px] font-medium text-[#171717] leading-snug text-center">
              Todo en un solo lugar Boca’o lo mejor!!
            </p>
          </div>
        </div>

        {/* Elemento Decorativo Vectorial (Vector 200:775) */}
        <div className="absolute right-[-5%] md:right-[5%] top-[55%] w-36 sm:w-56 md:w-[380px] pointer-events-none opacity-60">
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
