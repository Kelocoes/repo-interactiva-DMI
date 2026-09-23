export default function HomeFooter() {
  return (
    <footer id="contacto" className="w-full pb-10 px-4 sm:px-8 max-w-[1728px] mx-auto bg-[#fbfbfb]">
      {/* Caja Azul Curvada Fiel al Diseño de Figma (185:376) */}
      <div className="w-full bg-[#534cf4] rounded-[24px] md:rounded-[36px] p-8 sm:p-14 md:p-20 text-white relative overflow-hidden shadow-2xl">
        
        {/* Grilla Principal de las 5 Columnas de Figma */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 relative z-10">
          
          {/* Columna 1: Contacto (200:735) */}
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl md:text-[40px] font-bold tracking-tight">
              Contacto
            </h3>
            <div className="space-y-2 text-base sm:text-xl md:text-[25px] font-normal text-white/90">
              <p>Carrera 63b #17-04</p>
              <p>3002896471</p>
              <p>Boca0@gmail.com</p>
            </div>
          </div>

          {/* Columna 2: Productos (200:736) */}
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl md:text-[40px] font-bold tracking-tight">
              Productos
            </h3>
            <div className="space-y-2 text-base sm:text-xl md:text-[25px] font-normal text-white/90">
              <p className="hover:text-white transition-colors cursor-pointer">Postres</p>
              <p className="hover:text-white transition-colors cursor-pointer">Bebidas</p>
            </div>
          </div>

          {/* Columna 3: Recursos (200:745) */}
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl md:text-[40px] font-bold tracking-tight">
              Recursos
            </h3>
            <div className="space-y-2 text-base sm:text-xl md:text-[25px] font-normal text-white/90">
              <p className="hover:text-white transition-colors cursor-pointer">Blog</p>
              <p className="hover:text-white transition-colors cursor-pointer">Newsletter</p>
              <p className="hover:text-white transition-colors cursor-pointer">Media</p>
              <p className="hover:text-white transition-colors cursor-pointer">White paper</p>
            </div>
          </div>

          {/* Columna 4: Legal (200:754) */}
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl md:text-[40px] font-bold tracking-tight">
              Legal
            </h3>
            <div className="space-y-2 text-base sm:text-xl md:text-[25px] font-normal text-white/90">
              <p className="hover:text-white transition-colors cursor-pointer">Privacidad</p>
              <p className="hover:text-white transition-colors cursor-pointer">Seguridad</p>
              <p className="hover:text-white transition-colors cursor-pointer">Terminos de uso</p>
              <p className="hover:text-white transition-colors cursor-pointer">Politicas</p>
              <p className="hover:text-white transition-colors cursor-pointer">Cookies</p>
            </div>
          </div>

          {/* Columna 5: Company & Redes Sociales (200:763) */}
          <div className="space-y-6">
            <h3 className="text-2xl sm:text-3xl md:text-[40px] font-bold tracking-tight">
              Company
            </h3>
            <div className="space-y-2 text-base sm:text-xl md:text-[25px] font-normal text-white/90">
              <p className="hover:text-white transition-colors cursor-pointer">About us</p>
              <p className="hover:text-white transition-colors cursor-pointer">Career</p>
              <p className="hover:text-white transition-colors cursor-pointer">FAQs</p>
              <p className="hover:text-white transition-colors cursor-pointer">Contact</p>
            </div>

            {/* Iconos de Redes Sociales de Figma (193:738, 193:753, etc.) */}
            <div className="flex items-center gap-3 pt-4">
              <a href="#instagram" className="w-[32px] h-[32px] rounded-full flex items-center justify-center hover:scale-110 transition-transform bg-white/10 hover:bg-white/20">
                <img src="/figma/ed864017d01987d7043092711dececa377f847e4.svg" alt="Instagram" className="w-[20px] h-[20px]" />
              </a>
              <a href="#social1" className="w-[32px] h-[32px] rounded-full flex items-center justify-center hover:scale-110 transition-transform bg-white/10 hover:bg-white/20">
                <img src="/figma/594204f7f912a8791890536f0ce75016d826172d.svg" alt="Red social" className="w-[20px] h-[20px]" />
              </a>
              <a href="#social2" className="w-[32px] h-[32px] rounded-full flex items-center justify-center hover:scale-110 transition-transform bg-white/10 hover:bg-white/20">
                <img src="/figma/b6014a0fc749c86f7882850dc73da23a8ceac921.svg" alt="Red social" className="w-[20px] h-[20px]" />
              </a>
              <a href="#social3" className="w-[32px] h-[32px] rounded-full flex items-center justify-center hover:scale-110 transition-transform bg-white/10 hover:bg-white/20">
                <img src="/figma/824d8ca1f9880ae9fe340172b9613aa4aab84eba.svg" alt="Red social" className="w-[20px] h-[20px]" />
              </a>
            </div>
          </div>

        </div>

        {/* Zona Inferior: Logo Tradicional e Ilustración Vectorial (173:327 & 200:671) */}
        <div className="mt-16 md:mt-24 pt-8 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src="/figma/b52e666654c6d145250a5319a4b608f813e022fe.png"
              alt="Dulces Típicos Vallunos"
              className="h-20 sm:h-28 w-auto object-contain drop-shadow"
            />
            <div className="text-white/80 text-sm">
              <p className="font-semibold text-white">Tradición & Dulces Típicos</p>
              <p>© {new Date().getFullYear()} Boca’o Valle del Cauca. Todos los derechos reservados.</p>
            </div>
          </div>

          <div className="text-white/60 text-xs">
            Hecho con pasión caleña en el Valle del Cauca.
          </div>
        </div>

        {/* Vector Decorativo Ondulado Inferior (Group 2 - 200:671) */}
        <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none opacity-20 -z-0">
          <img
            src="/figma/11df3d607b3caaa88b0aebe4d72cd2d4edac5063.svg"
            alt=""
            className="w-full h-auto min-w-[1000px]"
          />
        </div>

      </div>
    </footer>
  )
}
