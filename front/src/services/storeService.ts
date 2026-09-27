/**
 * Servicio y Base de Datos local para gestión de Tiendas de Boca'o
 * Preparado para extender fácilmente a backend NestJS / Base de datos SQL/NoSQL
 */

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
  /** Color primario del pin y acento */
  color1: string
  /** Color secundario del pin y fondo */
  color2: string
  /** Códigos de los 3 postres elegidos en la terminal */
  postres: string[]
}

const STORAGE_KEY = 'bocao_stores_v3'
const LIKED_KEY = 'bocao_liked_store_ids_v3'

/**
 * Tiendas iniciales del mock fieles a Figma (Frame 173-130).
 * Obleas la Caleñita: 130 likes
 * El Oasis: 100 likes
 */
export const INITIAL_STORES: Store[] = [
  {
    id: 'caleñita-2',
    lat: 3.4215,
    lng: -76.5458,
    nombre: 'Obleas la caleñita',
    descripcion:
      'Las mejores obleas y postres tradicionales en San Fernando, Cali. Deliciosas capas de arequipe, queso, mermelada y frutas frescas.',
    bannerPreview: '/figma/4e1306367bc471614c5de034d2b7ba22204b0f0c.png',
    logoPreview: null,
    address: 'Cl 5 #46B-58',
    likes: 130,
    color1: '#FFB200',
    color2: '#5552F6',
    postres: ['A2F4B1', 'C8D3E7', '9B1F6A'],
  },
  {
    id: 'oasis-1',
    lat: 3.3768,
    lng: -76.5364,
    nombre: 'El Oasis',
    descripcion:
      'Un increíble lugar para tardear con tu familia, amigos, compañeros o cualquier persona que esté dispuesta a probar los postres más dulces de Cali. Un excelente ambiente con juego, recreaciones y actividades para todos los miembros de la familia.',
    bannerPreview: '/figma/store_banner_oasis.png',
    logoPreview: null,
    address: 'Cra 83c #16-05',
    likes: 100,
    color1: '#FBFBFB', // Color de texto blanco suave en lugar de azul
    color2: '#D600C4', // Color de fondo del detalle y del pin en el mapa
    postres: ['A2F4B1', 'C8D3E7', '9B1F6A'],
  },
]

/**
 * Obtener listado de tiendas desde almacenamiento persistente o inicial
 */
export function getStoredStores(): Store[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STORES))
      return INITIAL_STORES
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
    return INITIAL_STORES
  } catch (err) {
    console.error('Error al leer bocao_stores de localStorage', err)
    return INITIAL_STORES
  }
}

/**
 * Guarda o actualiza la lista de tiendas en almacenamiento
 */
export function saveStoresToStorage(stores: Store[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stores))
  } catch (err) {
    console.error('Error al guardar bocao_stores en localStorage', err)
  }
}

/**
 * Agrega una nueva tienda al almacenamiento
 */
export function addStore(newStore: Store): Store[] {
  const current = getStoredStores()
  const updated = [newStore, ...current]
  saveStoresToStorage(updated)
  return updated
}

/**
 * Obtiene los IDs de las tiendas a las que el usuario actual les ha dado Like
 */
export function getLikedStoreIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LIKED_KEY)
    if (!raw) return new Set<string>()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set<string>()
  }
}

/**
 * Alterna el Like de una tienda (+1 o -1) y actualiza persistencia
 */
export function toggleLikeStore(storeId: string): {
  stores: Store[]
  isLiked: boolean
  updatedStore: Store | null
} {
  const likedSet = getLikedStoreIds()
  const isCurrentlyLiked = likedSet.has(storeId)

  if (isCurrentlyLiked) {
    likedSet.delete(storeId)
  } else {
    likedSet.add(storeId)
  }

  try {
    localStorage.setItem(LIKED_KEY, JSON.stringify(Array.from(likedSet)))
  } catch (e) {
    console.error('Error saving liked stores', e)
  }

  const currentStores = getStoredStores()
  let updatedStore: Store | null = null

  const updatedStores = currentStores.map((store) => {
    if (store.id === storeId) {
      const newLikes = isCurrentlyLiked ? Math.max(0, store.likes - 1) : store.likes + 1
      updatedStore = { ...store, likes: newLikes }
      return updatedStore
    }
    return store
  })

  saveStoresToStorage(updatedStores)

  return {
    stores: updatedStores,
    isLiked: !isCurrentlyLiked,
    updatedStore,
  }
}

/**
 * Retorna las tiendas ordenadas por número de Likes de forma descendente
 */
export function sortStoresByLikes(stores: Store[]): Store[] {
  return [...stores].sort((a, b) => b.likes - a.likes)
}
