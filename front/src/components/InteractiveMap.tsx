import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { io, Socket } from 'socket.io-client'
import { 
  MapPin, 
  Wifi, 
  WifiOff, 
  Trash2, 
  Navigation, 
  PlusCircle, 
  X, 
  Layers, 
  Utensils, 
  Coffee, 
  Trees, 
  Music, 
  Landmark, 
  ShoppingBag, 
  Hotel, 
  HeartPulse, 
  GraduationCap, 
  Star, 
  Trophy, 
  PanelRightOpen, 
  PanelRightClose, 
  Search, 
  ChevronRight, 
  Compass,
  ArrowLeft
} from 'lucide-react'

interface MapPoint {
  id: number
  lat: number
  lng: number
  title: string
  description?: string
  color: string
  icon?: string
  createdAt: string
}

const CALI_CENTER: [number, number] = [3.4516, -76.5320]
const FIXED_ZOOM = 13
const CALI_BOUNDS: L.LatLngBoundsLiteral = [
  [3.30, -76.65], // Suroeste
  [3.55, -76.42], // Noreste
]

const COLOR_PALETTE = [
  { name: 'Rojo', hex: '#ef4444', class: 'bg-red-500' },
  { name: 'Esmeralda', hex: '#10b981', class: 'bg-emerald-500' },
  { name: 'Azul', hex: '#3b82f6', class: 'bg-blue-500' },
  { name: 'Púrpura', hex: '#8b5cf6', class: 'bg-purple-500' },
  { name: 'Ámbar', hex: '#f59e0b', class: 'bg-amber-500' },
  { name: 'Cian', hex: '#06b6d4', class: 'bg-cyan-500' },
]

// Lista de Iconos Disponibles para Selección
const ICON_OPTIONS = [
  { id: 'map-pin', name: 'General', icon: MapPin },
  { id: 'utensils', name: 'Comida', icon: Utensils },
  { id: 'coffee', name: 'Café', icon: Coffee },
  { id: 'trees', name: 'Parque', icon: Trees },
  { id: 'music', name: 'Salsa / Rumba', icon: Music },
  { id: 'landmark', name: 'Monumento', icon: Landmark },
  { id: 'shopping-bag', name: 'Compras', icon: ShoppingBag },
  { id: 'hotel', name: 'Hotel', icon: Hotel },
  { id: 'heart-pulse', name: 'Salud', icon: HeartPulse },
  { id: 'graduation-cap', name: 'Universidad', icon: GraduationCap },
  { id: 'star', name: 'Favorito', icon: Star },
  { id: 'trophy', name: 'Deporte', icon: Trophy },
]

const getIconComponent = (iconId: string = 'map-pin') => {
  const item = ICON_OPTIONS.find((i) => i.id === iconId)
  return item ? item.icon : MapPin
}

// Generador de SVG vectorial para Leaflet
const getIconSvg = (iconId: string = 'map-pin') => {
  const size = 14
  switch (iconId) {
    case 'utensils':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 2v10a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M12 15v7"/><path d="M21 15v7"/><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/></svg>`
    case 'coffee':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>`
    case 'trees':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7l-2.6-3.8a1 1 0 0 0-1.6 0L10.2 7.3a1 1 0 0 0 .8 1.7H11l-3 3.3a1 1 0 0 0 .7 1.7H9l-3 3.3a1 1 0 0 0 .7 1.7H12"/></svg>`
    case 'music':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`
    case 'landmark':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`
    case 'shopping-bag':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`
    case 'hotel':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22v-6.57"/><path d="M12 11h.01"/><path d="M12 7h.01"/><path d="M14 15.43V22"/><path d="M15 11h.01"/><path d="M15 7h.01"/><path d="M16 11h.01"/><path d="M16 7h.01"/><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18Z"/><path d="M8 11h.01"/><path d="M8 7h.01"/><path d="M9 11h.01"/><path d="M9 7h.01"/></svg>`
    case 'heart-pulse':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`
    case 'graduation-cap':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`
    case 'star':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
    case 'trophy':
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`
    default:
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`
  }
}

// Función para resolver la URL del backend automáticamente
const getInitialBackendUrl = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('custom_backend_url')
    if (saved) return saved
    return window.location.origin
  }
  return 'http://localhost:3000'
}

interface InteractiveMapProps {
  onBackToHome?: () => void
}

export default function InteractiveMap({ onBackToHome }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const markersMapRef = useRef<Map<number, L.Marker>>(new Map())
  const socketRef = useRef<Socket | null>(null)

  const [isConnected, setIsConnected] = useState(false)
  const [points, setPoints] = useState<MapPoint[]>([])
  const [selectedColor, setSelectedColor] = useState('#ef4444')
  const [selectedIcon] = useState('map-pin')
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null)
  
  // IDs de puntos recién creados para mostrar pulso temporalmente
  const [recentPulseIds, setRecentPulseIds] = useState<Set<number>>(new Set())

  // Barra Lateral Estilo Maps
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null)
  const [searchFilter, setSearchFilter] = useState('')

  // Modal para ingresar datos de un nuevo punto
  const [modalData, setModalData] = useState<{
    isOpen: boolean
    lat: number
    lng: number
    title: string
    description: string
    color: string
    icon: string
  }>({
    isOpen: false,
    lat: 0,
    lng: 0,
    title: '',
    description: '',
    color: '#ef4444',
    icon: 'map-pin',
  })

  // Generador de iconos con insignia y símbolo SVG
  const createMarkerIcon = (color: string, iconId: string = 'map-pin', isRecent: boolean) => {
    const svgContent = getIconSvg(iconId)

    if (isRecent) {
      return L.divIcon({
        className: 'custom-pulse-container',
        html: `
          <div class="custom-pulse-marker">
            <div class="ring" style="background-color: ${color};"></div>
            <div class="icon-badge" style="background-color: ${color};">
              ${svgContent}
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
      })
    }

    return L.divIcon({
      className: 'custom-static-container',
      html: `
        <div class="custom-static-marker">
          <div class="icon-badge" style="background-color: ${color};">
            ${svgContent}
          </div>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
      popupAnchor: [0, -14],
    })
  }

  // Inicialización del Mapa
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return

    const map = L.map(mapContainerRef.current, {
      center: CALI_CENTER,
      zoom: FIXED_ZOOM,
      minZoom: FIXED_ZOOM,
      maxZoom: FIXED_ZOOM,
      maxBounds: CALI_BOUNDS,
      maxBoundsViscosity: 1.0,
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
    })

    // CartoDB Dark Matter para alto contraste
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap & CartoDB',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    const markersGroup = L.layerGroup().addTo(map)
    markersLayerRef.current = markersGroup
    mapInstanceRef.current = map

    // Clic para abrir el modal de nuevo punto
    map.on('click', (e: L.LeafletMouseEvent) => {
      setModalData({
        isOpen: true,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        title: '',
        description: '',
        color: selectedColor,
        icon: selectedIcon,
      })
    })

    // Rastreo de coordenadas en tiempo real
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorCoords({ lat: e.latlng.lat, lng: e.latlng.lng })
    })

    // Conexión Socket.io
    const backendUrl = getInitialBackendUrl()
    const socket = io(backendUrl, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
    })
    socketRef.current = socket

    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))

    // Cargar puntos existentes
    socket.on('initialPoints', (serverPoints: MapPoint[]) => {
      setPoints(serverPoints)
    })

    // Nuevo punto añadido en tiempo real por cualquier cliente
    socket.on('pointAdded', (newPoint: MapPoint) => {
      setPoints((prev) => [...prev, newPoint])
      
      // Activar pulso visual durante 4 segundos
      setRecentPulseIds((prev) => new Set(prev).add(newPoint.id))
      setTimeout(() => {
        setRecentPulseIds((prev) => {
          const next = new Set(prev)
          next.delete(newPoint.id)
          return next
        })
      }, 4000)
    })

    // Puntos limpiados
    socket.on('pointsCleared', () => {
      setPoints([])
      markersGroup.clearLayers()
      markersMapRef.current.clear()
      setSelectedPoint(null)
    })

    return () => {
      socket.disconnect()
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  // Sincronización de Marcadores en el Mapa Leaflet
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return

    const markersGroup = markersLayerRef.current
    const currentMarkerMap = markersMapRef.current

    // Remover marcadores que ya no están en la lista
    currentMarkerMap.forEach((marker, id) => {
      if (!points.some((p) => p.id === id)) {
        markersGroup.removeLayer(marker)
        currentMarkerMap.delete(id)
      }
    })

    // Añadir o actualizar marcadores
    points.forEach((point) => {
      const isRecent = recentPulseIds.has(point.id)
      const icon = createMarkerIcon(point.color, point.icon, isRecent)

      if (currentMarkerMap.has(point.id)) {
        const marker = currentMarkerMap.get(point.id)!
        marker.setIcon(icon)
      } else {
        const marker = L.marker([point.lat, point.lng], { icon })

        // Popup personalizado con estilo dark
        const dateFormatted = new Date(point.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        const popupContent = document.createElement('div')
        popupContent.className = 'p-3 min-w-[200px] text-slate-100'
        popupContent.innerHTML = `
          <div class="flex items-center gap-2 mb-1.5">
            <span class="w-3 h-3 rounded-full flex-shrink-0" style="background-color: ${point.color};"></span>
            <h4 class="font-bold text-sm tracking-tight text-white m-0 leading-tight">${point.title}</h4>
          </div>
          ${point.description ? `<p class="text-xs text-slate-300 mb-2 leading-relaxed m-0">${point.description}</p>` : ''}
          <div class="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-700/80">
            <span class="font-mono">${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</span>
            <span>${dateFormatted}</span>
          </div>
        `

        marker.bindPopup(popupContent)
        marker.on('click', () => {
          setSelectedPoint(point)
          setIsSidebarOpen(true)
        })

        markersGroup.addLayer(marker)
        currentMarkerMap.set(point.id, marker)
      }
    })
  }, [points, recentPulseIds])

  // Función para enfocar y centrar en un punto desde la barra lateral
  const focusPoint = (point: MapPoint) => {
    setSelectedPoint(point)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([point.lat, point.lng], { animate: true, duration: 0.5 })
    }
    const marker = markersMapRef.current.get(point.id)
    if (marker) {
      marker.openPopup()
    }
  }

  // Guardar nuevo punto tras completar el diálogo
  const handleSavePoint = (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalData.title.trim()) return

    if (socketRef.current) {
      socketRef.current.emit('addPoint', {
        lat: modalData.lat,
        lng: modalData.lng,
        title: modalData.title.trim(),
        description: modalData.description.trim(),
        color: modalData.color,
        icon: modalData.icon,
      })
    }

    setModalData((prev) => ({ ...prev, isOpen: false, title: '', description: '' }))
  }

  const handleClearPoints = () => {
    if (socketRef.current && confirm('¿Deseas limpiar todos los puntos del mapa?')) {
      socketRef.current.emit('clearPoints')
    }
  }

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(CALI_CENTER, FIXED_ZOOM)
    }
  }

  // Filtrado de puntos para la barra lateral
  const filteredPoints = points.filter((p) =>
    p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchFilter.toLowerCase()))
  )

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none flex">
      {/* Contenedor del Mapa Leaflet */}
      <div 
        ref={mapContainerRef} 
        className="flex-1 h-full z-0 cursor-crosshair transition-all duration-300" 
        style={{ width: '100%', height: '100vh' }}
      />

      {/* Barra Superior Flotante */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Título & Estado */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl rounded-2xl px-4 py-2.5 flex items-center gap-3 pointer-events-auto">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="btn btn-sm btn-ghost text-slate-300 hover:text-white px-2 py-1 mr-1 gap-1"
              title="Volver a la página principal"
            >
              <ArrowLeft className="w-4 h-4 text-[#534cf4]" />
              <span className="text-xs font-semibold">Inicio</span>
            </button>
          )}
          <div className="p-2 bg-rose-500/20 text-rose-400 rounded-xl shadow-inner">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Santiago de Cali
              <span className="badge badge-xs badge-neutral border-slate-600 text-slate-300 font-mono">
                Zoom Fijo {FIXED_ZOOM}x
              </span>
            </h1>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
              {isConnected ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-medium">WebSockets Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-rose-400 font-medium">Reconectando...</span>
                </>
              )}
              <span>•</span>
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {points.length} {points.length === 1 ? 'lugar' : 'lugares'}
              </span>
            </div>
          </div>
        </div>

        {/* Selector de Color y Acciones */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl rounded-2xl p-2 flex items-center gap-2 pointer-events-auto">
          {/* Selector de Color Activo */}
          <div className="flex items-center gap-1.5 px-2">
            <span className="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Color:</span>
            {COLOR_PALETTE.map((color) => (
              <button
                key={color.hex}
                onClick={() => { setSelectedColor(color.hex); }}
                className={`w-6 h-6 rounded-full transition-transform duration-150 ${color.class} ${
                  selectedColor === color.hex ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100 hover:scale-105'
                }`}
                title={`Color ${color.name}`}
              />
            ))}
          </div>

          <div className="divider divider-horizontal my-1 mx-0 hidden sm:flex"></div>

          {/* Botón Re-Centrar */}
          <button
            onClick={handleRecenter}
            className="btn btn-sm btn-square btn-ghost text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl"
            title="Centrar en Cali"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Botón Limpiar Puntos */}
          {points.length > 0 && (
            <button
              onClick={handleClearPoints}
              className="btn btn-sm btn-square btn-ghost text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded-xl"
              title="Limpiar todos los puntos"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          {/* Botón Alternar Barra Lateral */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`btn btn-sm rounded-xl gap-1.5 px-3 border-none ${
              isSidebarOpen 
                ? 'bg-primary text-primary-content shadow-lg shadow-primary/30' 
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            {isSidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            <span className="text-xs font-semibold">Lugares</span>
          </button>
        </div>
      </div>

      {/* Indicador de Coordenadas Inferior */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 text-[11px] font-mono text-slate-400 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-3 pointer-events-auto">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Haz clic en el mapa para marcar un dulce o lugar
          </span>
          {cursorCoords && (
            <span className="text-slate-500 hidden md:inline">
              [{cursorCoords.lat.toFixed(4)}, {cursorCoords.lng.toFixed(4)}]
            </span>
          )}
        </div>
      </div>

      {/* Barra Lateral Estilo Google Maps */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl z-20 flex flex-col transition-transform duration-300 ease-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cabecera del Panel */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" />
              Lugares Guardados
            </h2>
            <p className="text-xs text-slate-400">Marcados en tiempo real por la comunidad</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="btn btn-xs btn-circle btn-ghost text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Buscador */}
        <div className="p-3 border-b border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar lugares..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="input input-sm input-bordered bg-slate-800/80 border-slate-700 text-slate-200 placeholder-slate-500 pl-9 w-full text-xs rounded-xl focus:border-primary"
            />
          </div>
        </div>

        {/* Lista de Puntos */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filteredPoints.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <MapPin className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm font-medium">No hay lugares marcados</p>
              <p className="text-xs text-slate-600 mt-1">Haz clic en el mapa de Cali para añadir el primero.</p>
            </div>
          ) : (
            filteredPoints.map((point) => {
              const IconComp = getIconComponent(point.icon)
              const isSelected = selectedPoint?.id === point.id
              return (
                <div
                  key={point.id}
                  onClick={() => focusPoint(point)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected 
                      ? 'bg-slate-800/90 border-primary shadow-md' 
                      : 'bg-slate-800/40 border-slate-800/80 hover:bg-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <div 
                    className="p-2 rounded-xl text-white shadow-sm flex-shrink-0"
                    style={{ backgroundColor: point.color }}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-white truncate">{point.title}</h3>
                    {point.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{point.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                      <span className="font-mono">[{point.lat.toFixed(3)}, {point.lng.toFixed(3)}]</span>
                      <span>•</span>
                      <span>{new Date(point.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 self-center" />
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Modal / Diálogo para Crear Punto */}
      {modalData.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-md bg-slate-900 border border-slate-700/80 shadow-2xl rounded-2xl overflow-hidden">
            <div className="card-body p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-white">
                  <PlusCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-base">Nuevo Lugar en Cali</h3>
                </div>
                <button
                  onClick={() => setModalData((prev) => ({ ...prev, isOpen: false }))}
                  className="btn btn-xs btn-circle btn-ghost text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePoint} className="space-y-3.5">
                {/* Nombre del Punto */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold text-slate-300">Nombre del Lugar / Postre</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cholados del Parque Panamericano"
                    className="input input-bordered input-sm bg-slate-800 text-slate-100 border-slate-700 focus:border-primary w-full text-xs"
                    value={modalData.title}
                    onChange={(e) => setModalData((prev) => ({ ...prev, title: e.target.value }))}
                    autoFocus
                  />
                </div>

                {/* Categoría / Icono */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold text-slate-300">Categoría</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-950/40 rounded-xl border border-slate-800/80">
                    {ICON_OPTIONS.map((item) => {
                      const Icon = item.icon
                      const isSelected = modalData.icon === item.id
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setModalData((prev) => ({ ...prev, icon: item.id }))}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all ${
                            isSelected
                              ? 'bg-primary/20 border-primary text-primary font-semibold'
                              : 'bg-slate-800/40 border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                          }`}
                        >
                          <Icon className="w-4 h-4 mb-1" />
                          <span className="text-[10px] truncate max-w-full">{item.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Selección de Color del Punto */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold text-slate-300">Color del Marcador</span>
                  </label>
                  <div className="flex items-center gap-2 pt-1">
                    {COLOR_PALETTE.map((color) => (
                      <button
                        type="button"
                        key={color.hex}
                        onClick={() => setModalData((prev) => ({ ...prev, color: color.hex }))}
                        className={`w-7 h-7 rounded-full transition-transform ${color.class} ${
                          modalData.color === color.hex ? 'ring-2 ring-white scale-110 shadow-md' : 'opacity-60 hover:opacity-100'
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Descripción */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs font-semibold text-slate-300">Descripción (Opcional)</span>
                  </label>
                  <textarea
                    placeholder="Agrega recomendaciones, notas o información de interés..."
                    className="textarea textarea-bordered textarea-sm bg-slate-800 text-slate-100 border-slate-700 focus:border-primary w-full text-xs h-16"
                    value={modalData.description}
                    onChange={(e) => setModalData((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Coordenadas */}
                <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>Lat: {modalData.lat.toFixed(5)}</span>
                  <span>Lng: {modalData.lng.toFixed(5)}</span>
                </div>

                {/* Botones de Acción */}
                <div className="card-actions justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalData((prev) => ({ ...prev, isOpen: false }))}
                    className="btn btn-sm btn-ghost text-slate-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary gap-1"
                    disabled={!modalData.title.trim()}
                  >
                    Guardar Punto
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
