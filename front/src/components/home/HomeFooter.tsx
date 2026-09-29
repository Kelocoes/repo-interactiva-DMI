import { assetUrl } from '../../utils/assets'

export default function HomeFooter() {
  return (
    <footer id="contacto" className="w-full pb-8 sm:pb-12 px-4 sm:px-6 md:px-10 max-w-[1728px] mx-auto bg-[#fbfbfb]">
      {/* Contenedor Morado Fiel al Diseño de Figma */}
      <div className="w-full bg-[#534cf4] rounded-[24px] sm:rounded-[32px] md:rounded-[40px] pt-12 sm:pt-16 md:pt-20 px-6 sm:px-12 md:px-16 lg:px-20 pb-0 text-white relative overflow-hidden flex flex-col justify-between">

        {/* 5 Columnas de Figma con texto blanco nítido */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10 lg:gap-12 relative z-10">

          {/* Columna 1: Contacto */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Contacto
            </h3>
            <div className="space-y-2 text-sm sm:text-[15px] font-normal text-white">
              <p>Carrera 63b #17-04</p>
              <p>3002896471</p>
              <p>Boca0@gmail.com</p>
            </div>
          </div>

          {/* Columna 2: Productos */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Productos
            </h3>
            <div className="space-y-2 text-sm sm:text-[15px] font-normal text-white">
              <p><a href="#postres" className="hover:text-white/80 transition-colors">Postres</a></p>
              <p><a href="#postres" className="hover:text-white/80 transition-colors">Bebidas</a></p>
            </div>
          </div>

          {/* Columna 3: Recursos */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Recursos
            </h3>
            <div className="space-y-2 text-sm sm:text-[15px] font-normal text-white">
              <p><a href="#recetas" className="hover:text-white/80 transition-colors">Blog</a></p>
              <p className="cursor-pointer hover:text-white/80 transition-colors">Newsletter</p>
              <p className="cursor-pointer hover:text-white/80 transition-colors">Media</p>
              <p className="cursor-pointer hover:text-white/80 transition-colors">White paper</p>
            </div>
          </div>

          {/* Columna 4: Legal */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Legal
            </h3>
            <div className="space-y-2 text-sm sm:text-[15px] font-normal text-white">
              <p className="cursor-pointer hover:text-white/80 transition-colors">Privacidad</p>
              <p className="cursor-pointer hover:text-white/80 transition-colors">Seguridad</p>
              <p className="cursor-pointer hover:text-white/80 transition-colors">Terminos de uso</p>
              <p className="cursor-pointer hover:text-white/80 transition-colors">Politicas</p>
              <p className="cursor-pointer hover:text-white/80 transition-colors">Cookies</p>
            </div>
          </div>

          {/* Columna 5: Company & Redes Sociales */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Company
            </h3>
            <div className="space-y-2 text-sm sm:text-[15px] font-normal text-white">
              <p className="cursor-pointer hover:text-white/80 transition-colors">About us</p>
              <p className="cursor-pointer hover:text-white/80 transition-colors">Career</p>
              <p className="cursor-pointer hover:text-white/80 transition-colors">FAQs</p>
              <p className="cursor-pointer hover:text-white/80 transition-colors">Contact</p>
            </div>

            {/* Iconos de Redes Sociales sin fondo, en blanco */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#instagram" aria-label="Instagram" className="hover:opacity-80 transition-opacity">
                <img src={assetUrl('/figma/ed864017d01987d7043092711dececa377f847e4.svg')} alt="Instagram" className="w-[18px] h-[18px]" />
              </a>
              <a href="#tiktok" aria-label="TikTok" className="hover:opacity-80 transition-opacity">
                <img src={assetUrl('/figma/594204f7f912a8791890536f0ce75016d826172d.svg')} alt="TikTok" className="w-[18px] h-[18px]" />
              </a>
              <a href="#facebook" aria-label="Facebook" className="hover:opacity-80 transition-opacity">
                <img src={assetUrl('/figma/b6014a0fc749c86f7882850dc73da23a8ceac921.svg')} alt="Facebook" className="w-[18px] h-[18px]" />
              </a>
              <a href="#x" aria-label="X (Twitter)" className="hover:opacity-80 transition-opacity">
                <img src={assetUrl('/figma/824d8ca1f9880ae9fe340172b9613aa4aab84eba.svg')} alt="X" className="w-[18px] h-[18px]" />
              </a>
            </div>
          </div>

        </div>

        {/* Zona Inferior: Logo Gigante Boca'o con Mascota encima de la B */}
        <div className="relative w-full mt-16 sm:mt-24 md:mt-32">
          {/* Mascota Pollito posado exactamente sobre la 'B' */}
          <div className="absolute left-[3.2%] sm:left-[3.5%] md:left-[3.8%] bottom-[88%] sm:bottom-[90%] md:bottom-[92%] w-[11%] sm:w-[9.5%] md:w-[8.5%] max-w-[140px] min-w-[55px] z-10 pointer-events-none">
            <img
              src={assetUrl('/figma/chick-mascot.png')}
              alt="Mascota Boca'o"
              className="w-full h-auto object-contain drop-shadow-md select-none"
            />
          </div>

          {/* Tipografía Gigante Blanca Boca'o con galleta y migajas */}
          <img
            src={assetUrl('/figma/11df3d607b3caaa88b0aebe4d72cd2d4edac5063.svg')}
            alt="Boca'o"
            className="w-full h-auto block select-none pointer-events-none transform translate-y-[2px]"
          />
        </div>

      </div>
    </footer>
  )
}
