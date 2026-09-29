/**
 * Servicio y Base de Datos para gestión de Tiendas de Boca'o
 * Conectado con Backend NestJS + PostgreSQL + WebSockets en tiempo real
 * Incluye fallback automático a almacenamiento local si el backend está iniciando
 */
import { io, Socket } from 'socket.io-client';

export interface Store {
  id: string;
  lat: number;
  lng: number;
  nombre: string;
  descripcion: string;
  bannerPreview: string | null;
  logoPreview: string | null;
  address: string;
  likes: number;
  /** Color primario del pin y acento (colorTexto) */
  color1: string;
  /** Color secundario del pin y fondo del detalle (colorFondo) */
  color2: string;
  /** Códigos de los 3 postres elegidos en la terminal */
  postres: string[];
}

const STORAGE_KEY = 'bocao_stores_v4';
const LIKED_KEY = 'bocao_liked_store_ids_v4';
export const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000').replace(/\/$/, '');

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
    color1: '#FBFBFB', // Texto blanco suave para Figma
    color2: '#D600C4', // Fondo del detalle y pin magenta
    postres: ['A2F4B1', 'C8D3E7', '9B1F6A'],
  },
];

/**
 * Convierte URLs de subidas a rutas relativas (/uploads/...) para que se sirvan
 * a través del proxy de Vite en el mismo origen, eliminando bloqueos ORB de Chrome
 */
export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes('/uploads/')) {
    return url.substring(url.indexOf('/uploads/'));
  }
  return url;
}

/**
 * Obtener listado de tiendas desde almacenamiento local (síncrono para estado inicial)
 */
export function getStoredStores(): Store[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_STORES));
      return INITIAL_STORES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((s) => ({
        ...s,
        bannerPreview: resolveImageUrl(s.bannerPreview),
        logoPreview: resolveImageUrl(s.logoPreview),
      }));
    }
    return INITIAL_STORES;
  } catch (err) {
    console.error('Error al leer bocao_stores de localStorage', err);
    return INITIAL_STORES;
  }
}

/**
 * Guarda o actualiza la lista de tiendas en almacenamiento local
 */
export function saveStoresToStorage(stores: Store[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
  } catch (err) {
    console.error('Error al guardar bocao_stores en localStorage', err);
  }
}

/**
 * Carga las tiendas desde la API de PostgreSQL en NestJS con fallback local
 */
export async function fetchStoresApi(search?: string): Promise<Store[]> {
  try {
    const url = search ? `${API_BASE_URL}/stores?search=${encodeURIComponent(search)}` : `${API_BASE_URL}/stores`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: Store[] = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      // Normalizar rutas de imágenes
      const normalized = data.map((s) => ({
        ...s,
        bannerPreview: resolveImageUrl(s.bannerPreview),
        logoPreview: resolveImageUrl(s.logoPreview),
      }));

      saveStoresToStorage(normalized);
      return normalized;
    }
    return getStoredStores();
  } catch (err) {
    console.warn('Backend API no disponible, usando fallback local de tiendas:', err);
    return getStoredStores();
  }
}

/**
 * Registra una nueva tienda en el Backend PostgreSQL y lo respalda localmente
 */
export async function createStoreApi(newStore: Partial<Store>): Promise<Store> {
  try {
    const res = await fetch(`${API_BASE_URL}/stores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify(newStore),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const msg = errorData.message || `Error al guardar tienda (${res.status})`;
      throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
    }

    const saved: Store = await res.json();
    saved.bannerPreview = resolveImageUrl(saved.bannerPreview);
    saved.logoPreview = resolveImageUrl(saved.logoPreview);

    const current = getStoredStores().filter((s) => s.id !== saved.id);
    const updated = [saved, ...current];
    saveStoresToStorage(updated);
    return saved;
  } catch (err) {
    console.warn('Fallo al guardar en Backend, registrando en almacenamiento local:', err);
    // Fallback local
    const fallbackStore: Store = {
      id: newStore.id || `store-${Date.now()}`,
      lat: newStore.lat || 3.42,
      lng: newStore.lng || -76.54,
      nombre: newStore.nombre || "Mi Tienda Boca'o",
      descripcion: newStore.descripcion || '',
      bannerPreview: newStore.bannerPreview || null,
      logoPreview: newStore.logoPreview || null,
      address: newStore.address || 'Cali, Valle del Cauca',
      likes: 0,
      color1: newStore.color1 || '#FBFBFB',
      color2: newStore.color2 || '#D600C4',
      postres: newStore.postres || ['A2F4B1', 'C8D3E7', '9B1F6A'],
    };
    const current = getStoredStores();
    const updated = [fallbackStore, ...current];
    saveStoresToStorage(updated);
    return fallbackStore;
  }
}

/**
 * Alterna el Like de una tienda atómicamente en PostgreSQL y sincroniza el cliente
 */
export async function toggleLikeStoreApi(
  storeId: string,
  isCurrentlyLiked: boolean,
): Promise<{ updatedStore: Store | null; isLiked: boolean }> {
  const nextIsLiked = !isCurrentlyLiked;
  const likedSet = getLikedStoreIds();

  if (nextIsLiked) {
    likedSet.add(storeId);
  } else {
    likedSet.delete(storeId);
  }

  try {
    localStorage.setItem(LIKED_KEY, JSON.stringify(Array.from(likedSet)));
  } catch (e) {
    console.error('Error saving liked stores', e);
  }

  try {
    const res = await fetch(`${API_BASE_URL}/stores/${storeId}/like`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
      body: JSON.stringify({ action: nextIsLiked ? 'like' : 'unlike' }),
    });

    if (res.ok) {
      const updated: Store = await res.json();
      updated.bannerPreview = resolveImageUrl(updated.bannerPreview);
      updated.logoPreview = resolveImageUrl(updated.logoPreview);

      const current = getStoredStores().map((s) => (s.id === storeId ? updated : s));
      saveStoresToStorage(current);
      return { updatedStore: updated, isLiked: nextIsLiked };
    }
  } catch (err) {
    console.warn('API de likes no disponible, ejecutando like local:', err);
  }

  // Fallback local
  let updatedStore: Store | null = null;
  const current = getStoredStores().map((s) => {
    if (s.id === storeId) {
      const newLikes = nextIsLiked ? s.likes + 1 : Math.max(0, s.likes - 1);
      updatedStore = { ...s, likes: newLikes };
      return updatedStore;
    }
    return s;
  });
  saveStoresToStorage(current);
  return { updatedStore, isLiked: nextIsLiked };
}

/**
 * Obtiene los IDs de las tiendas a las que el usuario actual les ha dado Like
 */
export function getLikedStoreIds(): Set<string> {
  try {
    const raw = localStorage.getItem(LIKED_KEY);
    if (!raw) return new Set<string>();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set<string>();
  }
}

/**
 * Ordena las tiendas de forma descendente por número de Likes
 */
export function sortStoresByLikes(stores: Store[]): Store[] {
  return [...stores].sort((a, b) => b.likes - a.likes);
}

/**
 * Conexión en tiempo real por WebSockets para sincronizar múltiples usuarios
 */
export function subscribeToRealtimeStores(
  onStoreCreated: (store: Store) => void,
  onStoreLiked: (payload: { id: string; likes: number }) => void,
): () => void {
  try {
    const socket: Socket = io(API_BASE_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      extraHeaders: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    socket.on('store:created', (store: Store) => {
      store.bannerPreview = resolveImageUrl(store.bannerPreview);
      store.logoPreview = resolveImageUrl(store.logoPreview);
      onStoreCreated(store);
    });

    socket.on('store:liked', (payload: { id: string; likes: number }) => {
      onStoreLiked(payload);
    });

    return () => {
      socket.disconnect();
    };
  } catch (err) {
    console.warn('No se pudo conectar al WebSocket:', err);
    return () => {};
  }
}
