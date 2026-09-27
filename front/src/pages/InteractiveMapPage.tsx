import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import MapHeaderBadge from '../components/map/MapHeaderBadge'
import MapSearchBar from '../components/map/MapSearchBar'
import MapControls from '../components/map/MapControls'
import MapInfoBanner from '../components/map/MapInfoBanner'
import MapFixedStoresBar from '../components/map/MapFixedStoresBar'
import StoresListModal from '../components/map/StoresListModal'
import StorePopup, { type StoreFormData } from '../components/map/StorePopup'
import StoreDetail from '../components/map/StoreDetail'
import logoResponsive from '../assets/interactive-map/logo_responsive.svg'
import {
  type Store,
  getStoredStores,
  addStore,
  toggleLikeStore,
  sortStoresByLikes,
  getLikedStoreIds,
} from '../services/storeService'

// Re-exportar interfaz Store para compatibilidad
export type { Store }

// ── Interfaces ──────────────────────────────────────────────────────────────

interface InteractiveMapPageProps {
  onBackToHome?: () => void
}

/** Coordenadas del punto donde el usuario hizo click en el mapa */
interface MapClickLocation {
  lat: number
  lng: number
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

// ── Helpers de marker ────────────────────────────────────────────────────────

/**
 * Genera el HTML del ícono SVG del pin fiel a Figma (#519:169 - Markers / Pinlet Marker with Dot).
 * El color del pin corresponde al color de fondo que tiene el detalle de la tienda (store.color2).
 */
function createPinIcon(pinColor: string): L.DivIcon {
  const svg = `
    <svg width="38" height="51" viewBox="0 0 102 136" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Sombra inferior en el suelo -->
      <ellipse cx="51" cy="123.25" rx="17" ry="8.5" fill="black" fill-opacity="0.18"/>
      
      <!-- Cuerpo del pin con borde blanco sutil y color del detalle de la tienda -->
      <path d="M51 8.5C74.4721 8.5 93.5 27.5279 93.5 51C93.5 64.9749 86.7539 77.3729 76.3418 85.1191C68.3325 91.1381 56.8906 100.677 54.2773 116.108C54.0026 117.729 52.644 118.987 51 118.987C49.356 118.987 47.9974 117.729 47.7227 116.108C45.1093 100.676 33.6666 91.1381 25.6572 85.1191C15.2455 77.3729 8.5 64.9746 8.5 51C8.5 27.5279 27.5279 8.5 51 8.5Z"
        fill="${pinColor}"
        stroke="#FFFFFF"
        stroke-width="3"
        stroke-linejoin="round" />

      <!-- Círculo interior translúcido más oscuro que su color de fondo, exactamente como en Figma #519:169 -->
      <circle cx="51" cy="51" r="17" fill="black" fill-opacity="0.4" />
    </svg>
  `.trim()

  return L.divIcon({
    className: 'custom-store-pin cursor-pointer transform hover:scale-110 transition-transform duration-200',
    html: svg,
    iconSize: [38, 51],
    iconAnchor: [19, 45],
    tooltipAnchor: [0, -45],
  })
}

/**
 * Genera el HTML del tooltip (tarjeta que aparece al hacer hover).
 * Fondo adaptado al color del pin / fondo del detalle de la tienda.
 */
function createTooltipHTML(store: Store): string {
  const pinBg = store.color2 || DEFAULT_COLOR2

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
      background:${pinBg};
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

  // Lista de tiendas cargadas desde el servicio de almacenamiento
  const [stores, setStores] = useState<Store[]>(() => getStoredStores())
  const [canZoomIn, setCanZoomIn] = useState<boolean>(true)
  const [canZoomOut, setCanZoomOut] = useState<boolean>(true)
  const [popupLocation, setPopupLocation] = useState<MapClickLocation | null>(null)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [isStoreListOpen, setIsStoreListOpen] = useState<boolean>(false)
  const [likedStoreIds, setLikedStoreIds] = useState<Set<string>>(() => getLikedStoreIds())

  const [searchQuery, setSearchQuery] = useState<string>('')

  // Tiendas filtradas en tiempo real por búsqueda y ordenadas por likes descendente
  const filteredStores = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    const list = query
      ? stores.filter(
          (s) =>
            s.nombre.toLowerCase().includes(query) ||
            s.address.toLowerCase().includes(query)
        )
      : stores

    return sortStoresByLikes(list)
  }, [stores, searchQuery])

  // Indicador si hay un pop up lateral de alguna card flotante activo (lista de tiendas o detalle de tienda)
  const hasLateralPopup = Boolean(isStoreListOpen || selectedStore)

  // Handler para dar o quitar Like a una tienda (+1 o -1)
  const handleToggleLike = useCallback((storeId: string) => {
    const result = toggleLikeStore(storeId)
    setStores(result.stores)
    setLikedStoreIds(getLikedStoreIds())

    if (result.updatedStore) {
      // Actualizar tooltip en el mapa de Leaflet
      const marker = leafletMarkersRef.current.get(storeId)
      if (marker) {
        marker.setTooltipContent(createTooltipHTML(result.updatedStore))
      }

      if (selectedStore?.id === storeId) {
        setSelectedStore(result.updatedStore)
      }
    }
  }, [selectedStore])

  // Handler para seleccionar una tienda desde cualquier card (centra el mapa y abre el detalle)
  const handleSelectStore = useCallback((store: Store) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([store.lat, store.lng], 15, { duration: 1.2 })
    }
    setSelectedStore(store)
    setIsStoreListOpen(false)
  }, [])

  // Función para agregar marker de una tienda al mapa
  const addStoreMarkerToMap = useCallback((store: Store, map: L.Map) => {
    // Si ya existe el marker, no duplicarlo
    if (leafletMarkersRef.current.has(store.id)) return

    // El color del pin corresponde al fondo del detalle de la tienda (store.color2)
    const icon = createPinIcon(store.color2 || DEFAULT_COLOR2)
    const marker = L.marker([store.lat, store.lng], { icon })

    marker.bindTooltip(createTooltipHTML(store), {
      permanent: false,
      direction: 'top',
      className: 'store-card-tooltip',
      offset: [0, -6],
      opacity: 1,
    })

    // Al hacer click en el marker se abre StoreDetail (deteniendo propagación al mapa)
    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e)
      setSelectedStore(store)
      setIsStoreListOpen(false)
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

    // Abrir el popup de crear tienda al hacer click en cualquier lugar del mapa
    // para captar exactamente las coordenadas que el usuario seleccionó
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      setIsStoreListOpen(false)
      setSelectedStore(null)
      setPopupLocation({ lat: e.latlng.lat, lng: e.latlng.lng })
    }
    map.on('click', handleMapClick)

    mapInstanceRef.current = map

    // Cargar tiendas iniciales en el mapa
    stores.forEach((store) => {
      addStoreMarkerToMap(store, map)
    })

    const timer = setTimeout(() => map.invalidateSize(), 200)

    return () => {
      clearTimeout(timer)
      map.off('zoomend', handleZoomEnd)
      map.off('click', handleMapClick)
      map.remove()
      mapInstanceRef.current = null
      leafletMarkersRef.current.clear()
    }
  }, [addStoreMarkerToMap, stores])

  // ── Guardar tienda: geocodifica, crea marker y lo añade al mapa y a la base local ────────────

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

    const updated = addStore(newStore)
    setStores(updated)
    addStoreMarkerToMap(newStore, mapInstanceRef.current)

    // Abre de inmediato el StoreDetail de la recién creada
    setSelectedStore(newStore)
    setIsStoreListOpen(false)
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
    setSearchQuery(query)
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
        <div className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 z-[1000] pointer-events-none flex items-center justify-between gap-4">
          {/* Logo normal a la izquierda cuando NO hay popup lateral (Transición suave y fluida) */}
          <div
            className={`pointer-events-auto shrink-0 flex items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
              hasLateralPopup
                ? 'opacity-0 -translate-x-8 scale-90 pointer-events-none'
                : 'opacity-100 translate-x-0 scale-100'
            }`}
          >
            <MapHeaderBadge onBackToHome={onBackToHome} />
          </div>

          {/* Barra de búsqueda y logo responsive al lado izquierdo de ella cuando SÍ hay popup lateral (Figma #519:194) */}
          <div className="pointer-events-auto flex items-center justify-end gap-2.5 sm:gap-3.5 w-full md:w-auto">
            {/* Contenedor animado del logo responsive */}
            <div
              className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform flex items-center shrink-0 ${
                hasLateralPopup
                  ? 'opacity-100 translate-x-0 scale-100 max-w-[80px]'
                  : 'opacity-0 translate-x-8 scale-75 max-w-0 overflow-hidden pointer-events-none'
              }`}
            >
              <button
                type="button"
                onClick={onBackToHome}
                title="Volver a la página principal"
                aria-label="Volver a la página principal"
                className="shrink-0 w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none drop-shadow-md"
              >
                <img
                  src={logoResponsive}
                  alt="Boca'o"
                  className="w-full h-full object-contain"
                />
              </button>
            </div>

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

        {/* 3. Barra Inferior con Banner Informativo y Cards fijas de tiendas (Figma Frame Map Page #173-130) */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 z-[1000] pointer-events-none flex flex-col-reverse lg:flex-row items-center lg:items-end justify-between gap-4">
          <MapInfoBanner />

          <MapFixedStoresBar
            stores={filteredStores}
            onSelectStore={handleSelectStore}
            onOpenFullList={() => setIsStoreListOpen(true)}
          />
        </div>

        {/* 4. Lista Completa de Tiendas en Card Flotante Lateral (Figma Frame Stores List #519:167) */}
        {isStoreListOpen && (
          <StoresListModal
            stores={filteredStores}
            onSelectStore={handleSelectStore}
            onClose={() => setIsStoreListOpen(false)}
          />
        )}

        {/* 5. Pop Up "¡Crea tu tienda!" — aparece al hacer doble click o click en registrar */}
        {popupLocation && (
          <StorePopup
            lat={popupLocation.lat}
            lng={popupLocation.lng}
            onClose={handleClosePopup}
            onSave={handleSaveStore}
          />
        )}

        {/* 6. Detalle de Tienda — Drawer lateral (Figma Frame Store Detail #262:149) */}
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
