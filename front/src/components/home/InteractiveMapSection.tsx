interface InteractiveMapSectionProps {
  onOpenMap: () => void
}

export default function InteractiveMapSection({ onOpenMap }: InteractiveMapSectionProps) {
  return (
    <section className="w-full py-20 md:py-32 bg-[#fbfbfb] overflow-hidden">
      <div className="max-w-[1728px] mx-auto px-6 md:px-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Columna Izquierda: Textos y Botón (Frame 10 & Frame 12) */}
          <div className="lg:col-span-5 flex flex-col items-start max-w-[520px]">
            {/* Título Mapa Interactivo */}
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl md:text-[64px] font-normal text-black leading-none tracking-tight">
                Mapa
              </h2>
              <span className="text-5xl sm:text-7xl md:text-[92px] font-semibold text-[#534cf4] leading-none tracking-tight block mt-1">
                Interactivo
              </span>
              
              {/* Garabato / Underline Doodle fiel a Figma (Line 4) */}
              <div className="w-[320px] sm:w-[380px] md:w-[402px] mt-2">
                <img
                  src="/figma/85d1485208e4e179073f475b6b292cf476d22e72.svg"
                  alt=""
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Descripción */}
            <p className="mt-8 md:mt-12 text-lg sm:text-xl md:text-[24px] text-[#171717] font-normal leading-relaxed">
              El mapa en el cual vas a poder encontrar los lugares para disfrutar de los mejores dulces típicos de todo el Valle.
            </p>

            {/* Botón CTA Ver Mapa (Color Rosa/Fucsia #d500cb en Figma) */}
            <button
              onClick={onOpenMap}
              className="mt-8 md:mt-12 w-[207px] h-[67px] rounded-[45px] bg-[#d500cb] hover:bg-[#ba00b2] text-[#fbfbfb] text-2xl md:text-[30px] font-medium flex items-center justify-center transition-all shadow-xl shadow-[#d500cb]/30 hover:scale-105 active:scale-95"
            >
              Ver Mapa
            </button>
          </div>

          {/* Columna Derecha: Mosaico Visual del Mapa (Figma Cards) */}
          <div className="lg:col-span-7 relative w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-[980px] ml-auto">
              
              {/* Sub-columna 1 & 2 (Izquierda del mosaico) */}
              <div className="sm:col-span-2 flex flex-col gap-5">
                {/* Fila superior: Card 1 (Mapa con Pin) y Card 2 (Foto dulce) */}
                <div className="grid grid-cols-2 gap-5">
                  
                  {/* Tarjeta Mapa 1 con marcador (195:599) */}
                  <div 
                    onClick={onOpenMap}
                    className="relative aspect-square rounded-[36px] overflow-hidden bg-[#e8e8e8] shadow-md hover:shadow-xl transition-all cursor-pointer group border border-slate-200"
                  >
                    <div className="absolute inset-0 scale-125 transform group-hover:scale-135 transition-transform duration-700">
                      <img src="/figma/67a6bb81c4a554af3119eb32fbebffe0da284d61.svg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <img src="/figma/4e072500f56ab5055f580074320d2394bfe66028.svg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <img src="/figma/f02e438bb5ab4593c41ec32cd829fd83ffa16c1f.svg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <img src="/figma/dac489a6a79abfe8219f2ffcf27d848c0cc2d187.svg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    {/* Pin Marker (195:642) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 drop-shadow-lg group-hover:scale-125 transition-transform">
                      <img src="/figma/b0d65b391d8866fc39b667cba893ea7b4c71e124.svg" alt="Pin" className="w-10 h-auto" />
                    </div>
                  </div>

                  {/* Tarjeta Foto Dulce (195:601) */}
                  <div className="relative aspect-square rounded-[36px] overflow-hidden bg-slate-100 shadow-md hover:shadow-xl transition-all border border-slate-200 group">
                    <img
                      src="/figma/4e1306367bc471614c5de034d2b7ba22204b0f0c.png"
                      alt="Dulce tradicional"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Fila inferior: Card 3 Foto Ciudad/Calle ancha (195:613) */}
                <div className="relative h-[220px] md:h-[290px] rounded-[36px] overflow-hidden bg-slate-100 shadow-md hover:shadow-xl transition-all border border-slate-200 group">
                  <img
                    src="/figma/9c57f566b1ecfa519d0baf95252f73f2ff1165d4.png"
                    alt="Calle de Cali"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-6">
                    <span className="text-white text-lg font-semibold flex items-center gap-2">
                      Rutas de tradición gastronómica
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-columna 3 (Derecha alta: Card 4 Mapa extendido 195:625) */}
              <div 
                onClick={onOpenMap}
                className="relative rounded-[36px] overflow-hidden bg-[#e8e8e8] shadow-md hover:shadow-xl transition-all cursor-pointer group border border-slate-200 min-h-[300px] sm:min-h-full"
              >
                <div className="absolute inset-0 scale-125 transform group-hover:scale-135 transition-transform duration-700">
                  <img src="/figma/67a6bb81c4a554af3119eb32fbebffe0da284d61.svg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <img src="/figma/4e072500f56ab5055f580074320d2394bfe66028.svg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <img src="/figma/f02e438bb5ab4593c41ec32cd829fd83ffa16c1f.svg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <img src="/figma/dac489a6a79abfe8219f2ffcf27d848c0cc2d187.svg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                {/* Pin Marker (195:652) */}
                <div className="absolute top-[42%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-10 drop-shadow-lg group-hover:scale-125 transition-transform">
                  <img src="/figma/9818e3559a00bb8aa7ee6198de27a3f08f5111bf.svg" alt="Pin" className="w-10 h-auto" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md shadow-md text-center">
                  <span className="text-sm font-bold text-[#534cf4]">Explorar en vivo →</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
