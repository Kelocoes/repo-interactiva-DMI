import HomeHeader from './HomeHeader'
import HeroSection from './HeroSection'
import DesiredDessertsSection from './DesiredDessertsSection'
import InteractiveMapSection from './InteractiveMapSection'
import AcclaimedRecipesSection from './AcclaimedRecipesSection'
import PromoBannerSection from './PromoBannerSection'
import HomeFooter from './HomeFooter'

interface HomePageProps {
  onOpenMap: () => void
}

export default function HomePage({ onOpenMap }: HomePageProps) {
  return (
    <div className="min-h-screen w-full bg-[#fbfbfb] text-[#171717] flex flex-col font-sans selection:bg-[#534cf4] selection:text-white overflow-x-hidden">
      {/* 1. Header con Navegación y Logo */}
      <HomeHeader onNavigateToMap={onOpenMap} />

      {/* 2. Hero Section con Titular, Botones, Mockup y Decoraciones */}
      <HeroSection onOpenMap={onOpenMap} />

      {/* 3. Sección "Postres más deseados" con las 4 tarjetas */}
      <DesiredDessertsSection />

      {/* 4. Sección "Mapa Interactivo" con botón y mosaico de preview */}
      <InteractiveMapSection onOpenMap={onOpenMap} />

      {/* 5. Sección "Cultura Valluna / Recetas Aclamadas" con 3 tarjetas rotadas */}
      <AcclaimedRecipesSection />

      {/* 6. Sección de Personaje y Globos de Diálogo */}
      <PromoBannerSection />

      {/* 7. Footer en caja azul curvada con las 5 columnas */}
      <HomeFooter />
    </div>
  )
}
