import React, { useCallback, useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import MapHeaderBadge from '../components/map/MapHeaderBadge'
import MapSearchBar from '../components/map/MapSearchBar'
import MapControls from '../components/map/MapControls'
import MapInfoBanner from '../components/map/MapInfoBanner'
import StorePopup, { type StoreFormData } from '../components/map/StorePopup'

// ── Interfaces ──────────────────────────────────────────────────────────────

interface InteractiveMapPageProps {
  onBackToHome?: () => void
}

/** Coordenadas del punto donde el usuario hizo click en el mapa */
interface MapClickLocation {
  lat: number
  lng: number
}

/** Modelo de datos de una tienda ya guardada */
export interface Store {
  id: string
  lat: number
  lng: number
  nombre: string
  descripcion: string
  bannerPreview: string | null
  logoPreview: string | null
  address: string
  likes: number
  /** Color primario del pin (fondo del pin) */
  color1: string
  /** Color secundario del pin (punto interior) */
  color2: string
}

// ── Constantes del mapa ─────────────────────────────────────────────────────

const CALI_CENTER: [number, number] = [3.4400, -76.5300]
const DEFAULT_ZOOM = 13
const MIN_ZOOM = 12
const MAX_ZOOM = 16

const CALI_BOUNDS: L.LatLngBoundsLiteral = [
  [3.3000, -76.6000],
  [3.5300, -76.4500],
]

// ── Colores predeterminados (grises) hasta que la terminal esté conectada ───
const DEFAULT_COLOR1 = '#6B6B6B'
const DEFAULT_COLOR2 = '#ADADAD'

// ── Helpers de marker ────────────────────────────────────────────────────────

/**
 * Genera el HTML del ícono SVG del pin en los colores dados.
 * Forma: gota clásica (teardrop) con círculo interior.
 */
function createPinIcon(color1: string, color2: string): L.DivIcon {
  const svg = `
    <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 42 16 42C16 42 32 24.837 32 16C32 7.163 24.837 0 16 0Z"
        fill="${color1}" />
      <circle cx="16" cy="16" r="7" fill="${color2}" />
      <circle cx="16" cy="16" r="4" fill="rgba(255,255,255,0.35)" />
    </svg>
  `.trim()

  return L.divIcon({
    className: 'custom-store-pin',
    html: svg,
    iconSize: [32, 42],
    iconAnchor: [16, 42],    // ancla en la punta inferior del pin
    tooltipAnchor: [0, -42], // tooltip sale justo encima del pin
  })
}

/**
 * Genera el HTML del tooltip (tarjeta que aparece al hacer hover).
 * Diseñado siguiendo el grupo EL-395d0a5d del Figma.
 */
function createTooltipHTML(store: Store): string {
  const bannerHtml = store.bannerPreview
    ? `<img src="${store.bannerPreview}"
          style="width:111px;height:67px;object-fit:cover;border-radius:8px;flex-shrink:0;" />`
    : `<div style="width:111px;height:67px;background:rgba(255,255,255,0.25);
                   border-radius:8px;flex-shrink:0;"></div>`

  const heartSvg = `<svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <path d="M6 9.5C6 9.5 0.5 5.8 0.5 2.8C0.5 1.3 1.7 0.5 3 0.5C4.2 0.5 5.3 1.2 6 2C6.7 1.2 7.8 0.5 9 0.5C10.3 0.5 11.5 1.3 11.5 2.8C11.5 5.8 6 9.5 6 9.5Z"
      stroke="#FFD166" stroke-width="1" fill="none"/>
  </svg>`

  return `
    <div class="store-card-inner" style="
      display:flex;
      align-items:center;
      gap:10px;
      background:${store.color1};
      border-radius:14px;
      padding:8px 12px 8px 8px;
      min-width:230px;
      max-width:260px;
      box-shadow:0 6px 20px rgba(0,0,0,0.35);
      font-family:'Plus Jakarta Sans',Inter,sans-serif;
    ">
      ${bannerHtml}
      <div style="flex:1;overflow:hidden;">
        <div style="
          color:#fff;
          font-weight:600;
          font-size:15px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
          margin-bottom:3px;
        ">${store.nombre || 'Sin nombre'}</div>
        <div style="
          color:rgba(255,255,255,0.75);
          font-size:10px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
          margin-bottom:5px;
        ">${store.address || ''}</div>
        <div style="display:flex;align-items:center;gap:4px;">
          ${heartSvg}
          <span style="color:rgba(255,255,255,0.8);font-size:10px;">
            ${store.likes} Me Gusta
          </span>
        </div>
      </div>
    </div>
  `
}

// ── Reverse geocoding con Nominatim (OpenStreetMap, sin API key) ─────────────

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=es`,
      { headers: { 'User-Agent': 'BocaoApp/1.0' } }
    )
    if (!res.ok) return ''
    const data = await res.json()
    // Intenta extraer calle + barrio o ciudad
    const addr = data.address || {}
    const parts = [
      addr.road,
      addr.house_number,
      addr.suburb || addr.neighbourhood || addr.city_district,
    ].filter(Boolean)
    return parts.join(' ').trim() || data.display_name?.split(',')[0] || ''
  } catch {
    return ''
  }
}

// ── Componente principal ─────────────────────────────────────────────────────

export const InteractiveMapPage: React.FC<InteractiveMapPageProps> = ({ onBackToHome }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  /** Mapa de id → marker de Leaflet para poder actualizarlos/eliminarlos */
  const leafletMarkersRef = useRef<Map<string, L.Marker>>(new Map())

  const [canZoomIn, setCanZoomIn] = useState<boolean>(true)
  const [canZoomOut, setCanZoomOut] = useState<boolean>(true)
  const [popupLocation, setPopupLocation] = useState<MapClickLocation | null>(null)

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
      maxBoundsViscosity: 1.0,
      zoomControl: false,
      attributionControl: false,
      doubleClickZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    const handleZoomEnd = () => {
      const z = map.getZoom()
      setCanZoomIn(z < MAX_ZOOM)
      setCanZoomOut(z > MIN_ZOOM)
    }
    map.on('zoomend', handleZoomEnd)
    handleZoomEnd()

    // Abrir el popup únicamente al hacer doble click en el mapa
    const handleMapDblClick = (e: L.LeafletMouseEvent) => {
      setPopupLocation({ lat: e.latlng.lat, lng: e.latlng.lng })
    }
    map.on('dblclick', handleMapDblClick)

    mapInstanceRef.current = map

    const timer = setTimeout(() => map.invalidateSize(), 200)

    return () => {
      clearTimeout(timer)
      map.off('zoomend', handleZoomEnd)
      map.off('dblclick', handleMapDblClick)
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // ── Guardar tienda: geocodifica, crea marker y lo añade al mapa ────────────

  const handleSaveStore = useCallback(async (formData: StoreFormData) => {
    // Cerrar popup inmediatamente para mejor UX
    setPopupLocation(null)

    if (!mapInstanceRef.current) return

    const id = `store-${Date.now()}`

    // Colores predeterminados (grises) hasta que la terminal esté conectada
    const color1 = DEFAULT_COLOR1
    const color2 = DEFAULT_COLOR2

    // Geocodificación inversa en paralelo (no bloquea el UI)
    const address = await reverseGeocode(formData.lat, formData.lng)

    const store: Store = {
      id,
      lat: formData.lat,
      lng: formData.lng,
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      bannerPreview: formData.bannerPreview,
      logoPreview: formData.logoPreview,
      address,
      likes: 0,
      color1,
      color2,
    }

    // Crear marker Leaflet con el ícono personalizado
    const icon = createPinIcon(color1, color2)
    const marker = L.marker([store.lat, store.lng], { icon })

    // Tooltip que aparece al hacer hover (card del Figma)
    marker.bindTooltip(createTooltipHTML(store), {
      permanent: false,
      direction: 'top',
      className: 'store-card-tooltip',
      offset: [0, -6],
      opacity: 1,
    })

    marker.addTo(mapInstanceRef.current)
    leafletMarkersRef.current.set(id, marker)
  }, [])

  // ── Handlers del mapa ────────────────────────────────────────────────────

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      const z = mapInstanceRef.current.getZoom()
      if (z < MAX_ZOOM) mapInstanceRef.current.zoomIn(1)
    }
  }

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      const z = mapInstanceRef.current.getZoom()
      if (z > MIN_ZOOM) mapInstanceRef.current.zoomOut(1)
    }
  }

  const handleSearch = (query: string) => {
    console.log('Buscando tienda:', query)
  }

  const handleExploreClick = () => {
    console.log('Acción Explorar tiendas activada')
  }

  const handleRegisterClick = () => {
    console.log('Acción Registrar tienda activada')
  }

  const handleClosePopup = useCallback(() => {
    setPopupLocation(null)
  }, [])

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="relative w-screen h-screen bg-[#FBFBFB] overflow-hidden flex flex-col p-2 sm:p-4 md:p-6 lg:p-8 select-none font-sans">
      <div className="relative w-full h-full rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl border border-neutral-200/80 bg-[#E8E8E8]">
        {/* Leaflet Map Canvas */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* 1. Header Superior */}
        <div className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 z-[1000] pointer-events-none flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="pointer-events-auto shrink-0 flex items-center">
            <MapHeaderBadge onBackToHome={onBackToHome} />
          </div>
          <div className="pointer-events-auto flex-1 flex justify-end">
            <MapSearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* 2. Controles Flotantes de Zoom */}
        <div className="absolute top-36 sm:top-40 md:top-48 right-4 sm:right-6 md:right-8 z-[1000] pointer-events-none flex flex-col items-center">
          <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            canZoomIn={canZoomIn}
            canZoomOut={canZoomOut}
          />
        </div>

        {/* 3. Barra Inferior */}
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
              className="hidden"
            />
          </div>
        </div>

        {/* 4. Pop Up — aparece al hacer click en el mapa */}
        {popupLocation && (
          <StorePopup
            lat={popupLocation.lat}
            lng={popupLocation.lng}
            onClose={handleClosePopup}
            onSave={handleSaveStore}
          />
        )}
      </div>
    </div>
  )
}

export default InteractiveMapPage
