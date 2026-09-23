import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import MapHeaderBadge from '../components/map/MapHeaderBadge'
import MapSearchBar from '../components/map/MapSearchBar'
import MapControls from '../components/map/MapControls'
import MapInfoBanner from '../components/map/MapInfoBanner'

interface InteractiveMapPageProps {
  onBackToHome?: () => void
}

// Coordenadas centrales de Cali, Colombia
const CALI_CENTER: [number, number] = [3.4400, -76.5300]
const DEFAULT_ZOOM = 13
const MIN_ZOOM = 12
const MAX_ZOOM = 15

// Límites estrictos para no permitir salirse de Cali
const CALI_BOUNDS: L.LatLngBoundsLiteral = [
  [3.31, -76.60], // Suroeste (Pance / límite sur)
  [3.52, -76.45], // Noreste (Sameco / Palmira / límite norte)
]

export const InteractiveMapPage: React.FC<InteractiveMapPageProps> = ({ onBackToHome }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  const [currentZoom, setCurrentZoom] = useState<number>(DEFAULT_ZOOM)
  const [canZoomIn, setCanZoomIn] = useState<boolean>(true)
  const [canZoomOut, setCanZoomOut] = useState<boolean>(true)

  // Inicialización del Mapa de Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const bounds = L.latLngBounds(CALI_BOUNDS[0], CALI_BOUNDS[1])

    const map = L.map(mapContainerRef.current, {
      center: CALI_CENTER,
      zoom: DEFAULT_ZOOM,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0, // Impide estrictamente salirse de los límites de Cali
      zoomControl: false,      // Usamos los controles personalizados de Figma
      attributionControl: false,
    })

    // Capa de mosaicos libre y moderna (CartoDB Positron sin necesidad de API key)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map)

    // Escuchar cambios de zoom para actualizar los estados de los botones
    const handleZoomEnd = () => {
      const z = map.getZoom()
      setCurrentZoom(z)
      setCanZoomIn(z < MAX_ZOOM)
      setCanZoomOut(z > MIN_ZOOM)
    }

    map.on('zoomend', handleZoomEnd)
    handleZoomEnd()

    mapInstanceRef.current = map

    // Invalidar tamaño luego de renderizado para ajustar viewport
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 200)

    return () => {
      clearTimeout(timer)
      map.off('zoomend', handleZoomEnd)
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Acciones de Zoom
  const handleZoomIn = () => {
    if (mapInstanceRef.current && currentZoom < MAX_ZOOM) {
      mapInstanceRef.current.zoomIn(1)
    }
  }

  const handleZoomOut = () => {
    if (mapInstanceRef.current && currentZoom > MIN_ZOOM) {
      mapInstanceRef.current.zoomOut(1)
    }
  }

  const handleSearch = (query: string) => {
    // Preparado para conectar con filtrado de tiendas en futuras fases
    console.log('Buscando tienda:', query)
  }

  const handleExploreClick = () => {
    console.log('Acción Explorar tiendas activada')
  }

  const handleRegisterClick = () => {
    console.log('Acción Registrar tienda activada')
  }

  return (
    <div className="relative w-screen h-screen bg-[#FBFBFB] overflow-hidden flex flex-col p-2 sm:p-4 md:p-6 lg:p-8 select-none font-sans">
      {/* Contenedor del Mapa con borde redondeado idéntico al frame de Figma (borderRadius: 40px) */}
      <div className="relative w-full h-full rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl border border-neutral-200/80 bg-[#E8E8E8]">
        {/* Leaflet Map Canvas */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* OVERLAYS / UI FLOTANTE FIEL A FIGMA (node-id=173-130) */}

        {/* 1. Header Superior: Logo Boca'o a la izquierda y Buscador a la derecha */}
        <div className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 z-[1000] pointer-events-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="pointer-events-auto shrink-0 flex items-center">
            <MapHeaderBadge onBackToHome={onBackToHome} />
          </div>

          <div className="pointer-events-auto flex-1 flex justify-end">
            <MapSearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* 2. Controles Flotantes a la Derecha (Zoom In / Zoom Out) */}
        <div className="absolute top-36 sm:top-40 md:top-48 right-4 sm:right-6 md:right-8 z-[1000] pointer-events-none flex flex-col items-center">
          <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            canZoomIn={canZoomIn}
            canZoomOut={canZoomOut}
          />
        </div>

        {/* 3. Barra Inferior: Banner Morado de Información (Izquierda) y Botón Explorar (Derecha) */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 z-[1000] pointer-events-none flex flex-col-reverse md:flex-row items-center md:items-end justify-between gap-4">
          <MapInfoBanner
            onRegisterClick={handleRegisterClick}
            onExploreClick={handleExploreClick}
          />

          <div className="pointer-events-auto shrink-0 hidden md:block">
            <MapControls
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onExploreClick={handleExploreClick}
              className="hidden" // Solo renderiza el botón de explorar aquí
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractiveMapPage
