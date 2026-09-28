import { useState, useEffect } from 'react'

interface NavItem {
  id: string
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'inicio', label: 'Inicio', href: '#inicio' },
  { id: 'postres', label: 'Nosotros', href: '#postres' },
  { id: 'contacto', label: 'Contacto', href: '#contacto' },
  { id: 'recetas', label: 'Blog', href: '#recetas' },
]

interface HomeHeaderProps {
  onNavigateToMap: () => void
  activeSection?: string
}

export default function HomeHeader({ onNavigateToMap, activeSection: activeSectionProp }: HomeHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(activeSectionProp || 'inicio')

  // Sincronizar si cambia el prop
  useEffect(() => {
    if (activeSectionProp) {
      setActiveSection(activeSectionProp)
    }
  }, [activeSectionProp])

  // Scroll spy para actualizar automáticamente la sección activa
  useEffect(() => {
    const handleScroll = () => {
      // Si estamos al final de la página, activar contacto/footer
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100) {
        setActiveSection('contacto')
        return
      }

      const scrollPosition = window.scrollY + 180

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i]
        const el = document.getElementById(item.id)
        if (el) {
          const top = el.offsetTop
          if (scrollPosition >= top) {
            setActiveSection(item.id)
            return
          }
        }
      }

      setActiveSection('inicio')
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100 transition-all">
      <div className="max-w-[1728px] mx-auto h-[90px] md:h-[100px] px-6 md:px-28 flex items-center justify-between relative">
        {/* Logo de Boca'o */}
        <a
          href="#inicio"
          onClick={() => setActiveSection('inicio')}
          className="flex items-center gap-3 shrink-0"
        >
          <img
            src="/figma/ea58c4e23739e24c7763d46274b1d34f56059793.svg"
            alt="Boca'o"
            className="h-8 md:h-[35px] w-auto object-contain"
          />
        </a>

        {/* Enlaces de Navegación (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12 absolute left-1/2 -translate-x-1/2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            return (
              <div
                key={item.id}
                className="relative flex flex-col items-center group cursor-pointer"
                onClick={() => setActiveSection(item.id)}
              >
                <a
                  href={item.href}
                  className={`text-[16px] lg:text-[17px] font-medium transition-colors ${
                    isActive ? 'text-[#534cf4]' : 'text-black hover:text-[#534cf4]'
                  }`}
                >
                  {item.label}
                </a>
                {/* Indicador activo fiel a Figma con animación suave */}
                <div
                  className={`w-5 h-[3px] rounded-full mt-1 transition-all duration-300 ${
                    isActive
                      ? 'bg-[#534cf4] opacity-100 scale-100'
                      : 'bg-[#534cf4] opacity-0 scale-50 group-hover:opacity-40 group-hover:scale-100'
                  }`}
                />
              </div>
            )
          })}
        </nav>

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
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => {
                  setActiveSection(item.id)
                  setIsMobileMenuOpen(false)
                }}
                className={`block text-lg font-medium transition-colors ${
                  isActive ? 'font-semibold text-[#534cf4]' : 'text-slate-700 hover:text-[#534cf4]'
                }`}
              >
                {item.label}
              </a>
            )
          })}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false)
              onNavigateToMap()
            }}
            className="w-full py-3 bg-[#534cf4] text-white font-semibold rounded-2xl shadow-md mt-2 text-center hover:bg-[#433cc7] transition-colors"
          >
            Ver Mapa Interactivo
          </button>
        </div>
      )}
    </header>
  )
}
