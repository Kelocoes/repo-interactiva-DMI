import React, { useCallback, useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import MapHeaderBadge from '../components/map/MapHeaderBadge'
import MapSearchBar from '../components/map/MapSearchBar'
import MapControls from '../components/map/MapControls'
import MapInfoBanner from '../components/map/MapInfoBanner'
import StorePopup, { type StoreFormData } from '../components/map/StorePopup'
import StoreDetail from '../components/map/StoreDetail'

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
  /** Color primario del pin — también usado para texto/acento (colorTexto de la terminal) */
  color1: string
  /** Color secundario del pin — fondo de la tarjeta (colorFondo de la terminal) */
  color2: string
  /** Códigos de los 3 postres elegidos en la terminal */
  postres: string[]
}

// ── Constantes del mapa ─────────────────────────────────────────────────────

const CALI_CENTER: [number, number] = [3.4000, -76.5380]
const DEFAULT_ZOOM = 13
const MIN_ZOOM = 12
const MAX_ZOOM = 16

const CALI_BOUNDS: L.LatLngBoundsLiteral = [
  [3.3000, -76.6000],
  [3.5300, -76.4500],
]

// ── Colores predeterminados ───
const DEFAULT_COLOR1 = '#5552F6'
const DEFAULT_COLOR2 = '#D600C4'

// ── Tiendas Iniciales Fieles a Figma ───────────────────────────────────────
const INITIAL_STORES: Store[] = [
  {
    id: 'oasis-1',
    lat: 3.3768,
    lng: -76.5364,
    nombre: 'Cholados El Oasis',
    descripcion:
      'Un increíble lugar para tardear con tu familia, amigos, compañeros o cualquier persona que esté dispuesta a probar los postres más dulces de Cali. Un excelente ambiente con juego, recreaciones y actividades para todos los miembros de la familia.',
    bannerPreview: '/figma/store_banner_oasis.png',
    logoPreview: null,
    address: 'Cra 83c #16-05, El Ingenio',
    likes: 140,
    color1: '#5552F6',
    color2: '#D600C4',
    postres: ['A2F4B1', 'C8D3E7', '9B1F6A'],
  },
  {
    id: 'caleñita-2',
    lat: 3.4215,
    lng: -76.5458,
    nombre: 'Obleas La Caleñita',
    descripcion:
      'Las mejores obleas y postres tradicionales en San Fernando, Cali. Deliciosas capas de arequipe, queso, mermelada y frutas frescas.',
    bannerPreview: '/figma/4e1306367bc471614c5de034d2b7ba22204b0f0c.png',
    logoPreview: null,
    address: 'Cl 5 #46B-58, San Fernando',
    likes: 130,
    color1: '#FFB200',
    color2: '#5552F6',
    postres: ['A2F4B1', 'C8D3E7', '9B1F6A'],
  },
]

// ── Helpers de marker ────────────────────────────────────────────────────────

/**
 * Genera el HTML del ícono SVG del pin en los colores dados.
 */
function createPinIcon(color1: string, color2: string): L.DivIcon {
  const svg = `
    <svg width="34" height="44" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 42 16 42C16 42 32 24.837 32 16C32 7.163 24.837 0 16 0Z"
        fill="${color1}" />
      <circle cx="16" cy="16" r="7" fill="${color2}" />
      <circle cx="16" cy="16" r="4" fill="rgba(255,255,255,0.4)" />
    </svg>
  `.trim()

  return L.divIcon({
    className: 'custom-store-pin cursor-pointer transform hover:scale-110 transition-transform',
    html: svg,
    iconSize: [34, 44],
    iconAnchor: [17, 44],
    tooltipAnchor: [0, -44],
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
      fill="#FFD166"/>
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
      cursor:pointer;
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
          color:rgba(255,255,255,0.85);
          font-size:10px;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
          margin-bottom:5px;
        ">${store.address || ''}</div>
        <div style="display:flex;align-items:center;gap:4px;">
          ${heartSvg}
          <span style="color:rgba(255,255,255,0.9);font-size:10px;">
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
  const leafletMarkersRef = useRef<Map<string, L.Marker>>(new Map())

  const [stores, setStores] = useState<Store[]>(INITIAL_STORES)
  const [canZoomIn, setCanZoomIn] = useState<boolean>(true)
  const [canZoomOut, setCanZoomOut] = useState<boolean>(true)
  const [popupLocation, setPopupLocation] = useState<MapClickLocation | null>(null)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [showStoreList, setShowStoreList] = useState<boolean>(false)
  const [likedStoreIds, setLikedStoreIds] = useState<Set<string>>(new Set())

  // Handler para dar o quitar Like a una tienda (+1 o -1)
  const handleToggleLike = useCallback((storeId: string) => {
    setLikedStoreIds((prevLiked) => {
      const nextLiked = new Set(prevLiked)
      const isCurrentlyLiked = nextLiked.has(storeId)

      if (isCurrentlyLiked) {
        nextLiked.delete(storeId)
      } else {
        nextLiked.add(storeId)
      }

      setStores((prevStores) =>
        prevStores.map((s) => {
          if (s.id === storeId) {
            const newLikes = isCurrentlyLiked ? Math.max(0, s.likes - 1) : s.likes + 1
            const updatedStore = { ...s, likes: newLikes }

            // Actualizar tooltip en el mapa de Leaflet
            const marker = leafletMarkersRef.current.get(storeId)
            if (marker) {
              marker.setTooltipContent(createTooltipHTML(updatedStore))
            }

            if (selectedStore?.id === storeId) {
              setSelectedStore(updatedStore)
            }
            return updatedStore
          }
          return s
        })
      )

      return nextLiked
    })
  }, [selectedStore])

  // Función para agregar marker de una tienda al mapa
  const addStoreMarkerToMap = useCallback((store: Store, map: L.Map) => {
    const icon = createPinIcon(store.color1, store.color2)
    const marker = L.marker([store.lat, store.lng], { icon })

    marker.bindTooltip(createTooltipHTML(store), {
      permanent: false,
      direction: 'top',
      className: 'store-card-tooltip',
      offset: [0, -6],
      opacity: 1,
    })

    // Al hacer click en el marker se abre StoreDetail
    marker.on('click', () => {
      setSelectedStore(store)
    })

    marker.addTo(map)
    leafletMarkersRef.current.set(store.id, marker)
  }, [])

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

    // Abrir el popup de crear tienda al hacer doble click en el mapa
    const handleMapDblClick = (e: L.LeafletMouseEvent) => {
      setPopupLocation({ lat: e.latlng.lat, lng: e.latlng.lng })
    }
    map.on('dblclick', handleMapDblClick)

    mapInstanceRef.current = map

    // Cargar tiendas iniciales en el mapa
    stores.forEach((store) => {
      addStoreMarkerToMap(store, map)
    })

    const timer = setTimeout(() => map.invalidateSize(), 200)

    return () => {
      clearTimeout(timer)
      map.off('zoomend', handleZoomEnd)
      map.off('dblclick', handleMapDblClick)
      map.remove()
      mapInstanceRef.current = null
    }
  }, [addStoreMarkerToMap, stores])

  // ── Guardar tienda: geocodifica, crea marker y lo añade al mapa ────────────

  const handleSaveStore = useCallback(async (formData: StoreFormData) => {
    setPopupLocation(null)

    if (!mapInstanceRef.current) return

    const id = `store-${Date.now()}`

    // Usar los colores y postres configurados en la terminal
    const color1 = formData.color1 || DEFAULT_COLOR1
    const color2 = formData.color2 || DEFAULT_COLOR2
    const postres = formData.postres?.length === 3 ? formData.postres : ['A2F4B1', 'C8D3E7', '9B1F6A']

    const address = await reverseGeocode(formData.lat, formData.lng)

    const newStore: Store = {
      id,
      lat: formData.lat,
      lng: formData.lng,
      nombre: formData.nombre || "Mi Tienda Boca'o",
      descripcion: formData.descripcion || 'Una nueva tienda tradicional en Cali',
      bannerPreview: formData.bannerPreview || '/figma/store_banner_oasis.png',
      logoPreview: formData.logoPreview,
      address: address || 'Cali, Valle del Cauca',
      likes: 0,
      color1,
      color2,
      postres,
    }

    setStores((prev) => [...prev, newStore])
    addStoreMarkerToMap(newStore, mapInstanceRef.current)

    // Abre de inmediato el StoreDetail de la recién creada (con 0 likes)
    setSelectedStore(newStore)
  }, [addStoreMarkerToMap])

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
    const term = query.toLowerCase().trim()
    if (!term) return

    const matched = stores.find(
      (s) => s.nombre.toLowerCase().includes(term) || s.address.toLowerCase().includes(term)
    )

    if (matched && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([matched.lat, matched.lng], 15, { duration: 1.2 })
      setSelectedStore(matched)
    }
  }

  const handleExploreClick = () => {
    setShowStoreList((prev) => !prev)
  }

  const handleRegisterClick = () => {
    if (mapInstanceRef.current) {
      const center = mapInstanceRef.current.getCenter()
      setPopupLocation({ lat: center.lat, lng: center.lng })
    }
  }

  const handleClosePopup = useCallback(() => {
    setPopupLocation(null)
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none font-sans">
      <div className="relative w-full h-full overflow-hidden bg-[#E8E8E8]">
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
        <div className="absolute top-20 sm:top-24 md:top-28 right-4 sm:right-6 md:right-8 z-[1000] pointer-events-none flex flex-col items-center">
          <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            canZoomIn={canZoomIn}
            canZoomOut={canZoomOut}
          />
        </div>

        {/* 3. Tarjetas flotantes de tiendas (Figma Frame Map Page #251:302 & #251:313) */}
        {showStoreList && (
          <div className="absolute bottom-28 right-4 sm:right-8 z-[1000] pointer-events-auto flex flex-col sm:flex-row gap-4 max-w-[90vw] overflow-x-auto p-2 bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 shadow-2xl">
            {stores.map((store) => (
              <div
                key={store.id}
                onClick={() => {
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([store.lat, store.lng], 15, { duration: 1 })
                  }
                  setSelectedStore(store)
                }}
                className="w-[280px] sm:w-[312px] bg-white rounded-[16px] p-3 shadow-md hover:shadow-xl transition-all cursor-pointer flex gap-3 items-center border border-neutral-100 group"
              >
                <img
                  src={store.bannerPreview || '/figma/store_banner_oasis.png'}
                  alt={store.nombre}
                  className="w-[106px] h-[75px] object-cover rounded-[16px] shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <h4 className="font-semibold text-[16px] text-neutral-900 truncate">
                    {store.nombre}
                  </h4>
                  <p className="text-xs text-neutral-500 truncate mb-1">{store.address}</p>
                  <div className="flex items-center gap-1 text-[13px] text-neutral-600">
                    <svg width="14" height="12" viewBox="0 0 12 10" fill="none">
                      <path
                        d="M6 9.5C6 9.5 0.5 5.8 0.5 2.8C0.5 1.3 1.7 0.5 3 0.5C4.2 0.5 5.3 1.2 6 2C6.7 1.2 7.8 0.5 9 0.5C10.3 0.5 11.5 1.3 11.5 2.8C11.5 5.8 6 9.5 6 9.5Z"
                        fill="#534CF4"
                      />
                    </svg>
                    <span>{store.likes} Me Gusta</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Barra Inferior */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 z-[1000] pointer-events-none flex flex-col-reverse md:flex-row items-center md:items-end justify-between gap-4">
          <MapInfoBanner
            onRegisterClick={handleRegisterClick}
            onExploreClick={handleExploreClick}
          />
        </div>

        {/* 5. Pop Up "¡Crea tu tienda!" — aparece al hacer doble click o click en registrar */}
        {popupLocation && (
          <StorePopup
            lat={popupLocation.lat}
            lng={popupLocation.lng}
            onClose={handleClosePopup}
            onSave={handleSaveStore}
          />
        )}

        {/* 6. Detalle de Tienda — (Figma Frame Store Detail #262:149) */}
        {selectedStore && (
          <StoreDetail
            store={selectedStore}
            isLiked={likedStoreIds.has(selectedStore.id)}
            onToggleLike={() => handleToggleLike(selectedStore.id)}
            onClose={() => setSelectedStore(null)}
          />
        )}
      </div>
    </div>
  )
}

export default InteractiveMapPage
