import { useState } from 'react'

interface HomeHeaderProps {
  onNavigateToMap: () => void
  activeSection?: string
}

export default function HomeHeader({ onNavigateToMap }: HomeHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-neutral-100 transition-all">
      <div className="max-w-[1728px] mx-auto h-[90px] md:h-[100px] px-6 md:px-28 flex items-center justify-between relative">
        {/* Logo de Boca'o */}
        <a href="#inicio" className="flex items-center gap-3 shrink-0">
          <img
            src="/figma/ea58c4e23739e24c7763d46274b1d34f56059793.svg"
            alt="Boca'o"
            className="h-8 md:h-[35px] w-auto object-contain"
          />
        </a>

        {/* Enlaces de Navegación (Desktop) */}
        <nav className="hidden md:flex items-center gap-10 lg:gap-14 absolute left-1/2 -translate-x-1/2">
          {/* Inicio (Activo) */}
          <div className="relative flex flex-col items-center group cursor-pointer">
            <a
              href="#inicio"
              className="text-[22px] lg:text-[25px] font-medium text-black hover:text-[#534cf4] transition-colors"
            >
              Inicio
            </a>
            {/* Indicador activo fiel a Figma (Line 1) */}
            <div className="w-5 h-[3px] bg-black rounded-full mt-1 group-hover:bg-[#534cf4] transition-colors" />
          </div>

          <a
            href="#postres"
            className="text-[22px] lg:text-[25px] font-medium text-black hover:text-[#534cf4] transition-colors"
          >
            Nosotros
          </a>

          <a
            href="#contacto"
            className="text-[22px] lg:text-[25px] font-medium text-black hover:text-[#534cf4] transition-colors"
          >
            Contacto
          </a>

          <a
            href="#recetas"
            className="text-[22px] lg:text-[25px] font-medium text-black hover:text-[#534cf4] transition-colors"
          >
            Blog
          </a>
        </nav>

        {/* Botón CTA Mapa para acceso rápido */}
        <div className="hidden md:flex items-center">
          <button
            onClick={onNavigateToMap}
            className="px-6 py-2.5 bg-[#534cf4] hover:bg-[#433cc7] text-white text-base lg:text-lg font-semibold rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            Abrir Mapa
          </button>
        </div>

        {/* Botón menú móvil */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-black rounded-xl"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Menú Móvil desplegable */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 animate-fade-in shadow-lg">
          <a
            href="#inicio"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-lg font-semibold text-[#534cf4]"
          >
            Inicio
          </a>
          <a
            href="#postres"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-lg font-medium text-slate-700 hover:text-black"
          >
            Nosotros
          </a>
          <a
            href="#contacto"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-lg font-medium text-slate-700 hover:text-black"
          >
            Contacto
          </a>
          <a
            href="#recetas"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-lg font-medium text-slate-700 hover:text-black"
          >
            Blog
          </a>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false)
              onNavigateToMap()
            }}
            className="w-full py-3 bg-[#534cf4] text-white font-semibold rounded-2xl shadow-md mt-2 text-center"
          >
            Ver Mapa Interactivo
          </button>
        </div>
      )}
    </header>
  )
}
