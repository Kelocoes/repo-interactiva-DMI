import HomeHeader from '../components/home/HomeHeader'
import HeroSection from '../components/home/HeroSection'
import DesiredDessertsSection from '../components/home/DesiredDessertsSection'
import InteractiveMapSection from '../components/home/InteractiveMapSection'
import AcclaimedRecipesSection from '../components/home/AcclaimedRecipesSection'
import PromoBannerSection from '../components/home/PromoBannerSection'
import HomeFooter from '../components/home/HomeFooter'

interface HomePageProps {
  onOpenMap: () => void
}

export default function HomePage({ onOpenMap }: HomePageProps) {
  return (
    <div className="min-h-screen w-full bg-[#fbfbfb] text-[#171717] flex flex-col font-sans selection:bg-[#534cf4] selection:text-white overflow-x-clip">
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
