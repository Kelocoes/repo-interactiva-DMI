export default function AcclaimedRecipesSection() {
  return (
    <section id="recetas" className="w-full py-24 md:py-36 bg-[#fbfbfb] overflow-hidden">
      <div className="max-w-[1728px] mx-auto px-6 md:px-28">
        
        {/* Cabecera de Sección (196:127 & 196:122) */}
        <div className="flex flex-col items-start gap-1 mb-16 md:mb-24">
          <span className="text-2xl md:text-[32px] font-normal text-black tracking-tight">
            Cultura Valluna
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-[72px] font-semibold text-[#534cf4] tracking-tight leading-tight">
            Recetas Aclamadas
          </h2>
        </div>

        {/* Tarjetas de Recetas (Inclinaciones exactas de Figma: -6.17°, 0°, +6.07°) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 justify-items-center items-center pt-8">
          
          {/* Tarjeta 1: Cholado (Amarillo #ffb200, tilt -6.17deg) */}
          <div className="w-full max-w-[466px] transition-transform duration-300 hover:rotate-0 hover:scale-105">
            <div className="lg:-rotate-[6.17deg] h-[680px] sm:h-[745px] w-full bg-[#ffb200] rounded-[50px] p-8 sm:p-12 relative overflow-hidden shadow-2xl flex flex-col justify-between">
              
              {/* Vector Decorativo de Fondo */}
              <div className="absolute right-[-20%] top-[10%] w-[320px] pointer-events-none opacity-40">
                <img src="/figma/d46cfb035c113c6c73870cf81772ed2a9d5eb0d1.svg" alt="" className="w-full h-auto" />
              </div>

              {/* Título */}
              <div className="relative z-10">
                <h3 className="text-3xl sm:text-[40px] font-bold text-white tracking-tight leading-tight">
                  Cholado
                </h3>
              </div>

              {/* Imagen Central del Postre */}
              <div className="relative z-10 my-auto flex items-center justify-center py-4">
                <img
                  src="/figma/6400ac4210fb3544891bb1eff7fbf3c62fa05a18.png"
                  alt="Cholado valluno"
                  className="max-h-[300px] sm:max-h-[360px] w-auto object-contain drop-shadow-2xl"
                />
              </div>

              {/* Tiempo y Descripción */}
              <div className="relative z-10 text-white space-y-1">
                <p className="text-xl sm:text-2xl font-black mb-1">
                  20 min
                </p>
                <p className="text-base sm:text-[22px] leading-relaxed font-normal opacity-95">
                  El cholado es un postre refrescante que combina la tradición caleña con el sabor tropical de las frutas del Valle del Cauca.
                </p>
              </div>

            </div>
          </div>

          {/* Tarjeta 2: Manjar Blanco (Magenta/Fucsia #d600c4, posición central erguida) */}
          <div className="w-full max-w-[466px] transition-transform duration-300 hover:scale-105">
            <div className="h-[680px] sm:h-[745px] w-full bg-[#d600c4] rounded-[50px] p-8 sm:p-12 relative overflow-hidden shadow-2xl flex flex-col justify-between">
              
              {/* Vector Decorativo de Fondo */}
              <div className="absolute left-[-20%] top-[10%] w-[350px] pointer-events-none opacity-40">
                <img src="/figma/b456207775f61b462f09ffc74b804aadc6bd0e73.svg" alt="" className="w-full h-auto" />
              </div>

              {/* Título */}
              <div className="relative z-10">
                <h3 className="text-3xl sm:text-[40px] font-bold text-white tracking-tight leading-tight">
                  Manjar Blanco
                </h3>
              </div>

              {/* Imagen Central del Postre (con leve rotación 7.51deg de Figma) */}
              <div className="relative z-10 my-auto flex items-center justify-center py-4">
                <img
                  src="/figma/b540666cb93a8dc680d229bc863457bb8bb7395a.png"
                  alt="Manjar Blanco tradicional"
                  className="max-h-[290px] sm:max-h-[340px] w-auto object-contain drop-shadow-2xl transform rotate-[7.5deg]"
                />
              </div>

              {/* Tiempo y Descripción */}
              <div className="relative z-10 text-white space-y-1">
                <p className="text-xl sm:text-2xl font-black mb-1">
                  50 min
                </p>
                <p className="text-base sm:text-[22px] leading-relaxed font-normal opacity-95">
                  El manjar blanco es un dulce vallecaucano. Solo necesitas arroz, leche y azúcar.
                </p>
              </div>

            </div>
          </div>

          {/* Tarjeta 3: Cocadas (Azul Real #534cf4, tilt +6.07deg) */}
          <div className="w-full max-w-[466px] transition-transform duration-300 hover:rotate-0 hover:scale-105">
            <div className="lg:rotate-[6.07deg] h-[680px] sm:h-[745px] w-full bg-[#534cf4] rounded-[50px] p-8 sm:p-12 relative overflow-hidden shadow-2xl flex flex-col justify-between">
              
              {/* Vector Decorativo de Fondo */}
              <div className="absolute right-[-15%] top-[15%] w-[330px] pointer-events-none opacity-40">
                <img src="/figma/a494725bcebd1622662ed47d6cdcc49ad352983e.svg" alt="" className="w-full h-auto" />
              </div>

              {/* Título */}
              <div className="relative z-10">
                <h3 className="text-3xl sm:text-[40px] font-bold text-white tracking-tight leading-tight">
                  Cocadas
                </h3>
              </div>

              {/* Imagen Central del Postre */}
              <div className="relative z-10 my-auto flex items-center justify-center py-4">
                <img
                  src="/figma/41995ef99ef2ef0a84afa875e45938dc42f2f03f.png"
                  alt="Cocadas de coco"
                  className="max-h-[290px] sm:max-h-[340px] w-auto object-contain drop-shadow-2xl"
                />
              </div>

              {/* Tiempo y Descripción */}
              <div className="relative z-10 text-white space-y-1">
                <p className="text-xl sm:text-2xl font-black mb-1">
                  25 min
                </p>
                <p className="text-base sm:text-[22px] leading-relaxed font-normal opacity-95">
                  Las cocadas son un dulce tradicional que refleja la esencia tropical de la costa pacífica colombiana.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
