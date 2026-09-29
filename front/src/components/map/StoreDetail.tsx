import React from 'react'
import type { Store } from '../../pages/InteractiveMapPage'
import { POSTRE_CATALOG } from '../../constants/postresCatalog'
import { assetUrl } from '../../utils/assets'

interface StoreDetailProps {
  store: Store
  isLiked?: boolean
  onToggleLike?: () => void
  onClose: () => void
}

export const StoreDetail: React.FC<StoreDetailProps> = ({
  store,
  isLiked = false,
  onToggleLike,
  onClose,
}) => {
  const textColor = store.color1 || '#5552F6'
  const backgroundColor = store.color2 || '#FFFFFF'

  // Resolver postres seleccionados en la terminal para esta tienda
  const resolvedProducts = (store.postres || [])
    .map((code) => POSTRE_CATALOG[code])
    .filter(Boolean)

  const displayProducts =
    resolvedProducts.length > 0
      ? resolvedProducts
      : [
          POSTRE_CATALOG['A2F4B1'],
          POSTRE_CATALOG['C8D3E7'],
          POSTRE_CATALOG['9B1F6A'],
        ].filter(Boolean)

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div
      id="store-detail-overlay"
      onClick={onClose}
      className="absolute inset-0 z-[2000] flex items-center justify-start p-4 sm:p-6 md:p-8 lg:p-10 bg-black/35 backdrop-blur-xs select-none"
      style={{ animation: 'fade-in 0.2s ease-out' }}
    >
      {/* Drawer / Panel Principal con fondo y texto personalizados según la terminal */}
      <div
        id="store-detail-panel"
        onClick={stopPropagation}
        className="relative w-full max-w-[450px] max-h-[82vh] my-auto flex flex-col rounded-[28px] sm:rounded-[36px] shadow-2xl overflow-hidden border border-black/10 transition-colors duration-300"
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          animation: 'slide-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        }}
      >
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto custom-popup-scroll">
          {/* 1. Header Banner Image */}
          <div className="relative w-full h-[180px] sm:h-[210px] md:h-[230px] bg-neutral-200 overflow-hidden shrink-0">
            <img
              src={store.bannerPreview || assetUrl('/figma/store_banner_oasis.png')}
              alt={store.nombre}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay for Text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30" />

            {/* Close Button (Floating Top Right) */}
            <button
              id="store-detail-close-btn"
              onClick={onClose}
              className="absolute top-3.5 right-3.5 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white backdrop-blur-md flex items-center justify-center text-neutral-800 transition-transform active:scale-95 shadow-md"
              aria-label="Cerrar detalles de la tienda"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 2L14 14M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Logo Avatar Badge if present */}
            {store.logoPreview && (
              <div className="absolute bottom-3 left-5 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-white">
                <img
                  src={store.logoPreview}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* 2. Cuerpo del Detalle */}
          <div className="p-5 sm:p-7 flex flex-col gap-5">
            {/* Fila Título + Heart / Likes Toggle */}
            <div className="flex items-start justify-between gap-3">
              <h1
                className="text-2xl sm:text-3xl md:text-[30px] font-extrabold leading-tight tracking-tight"
                style={{
                  color: textColor,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {store.nombre || 'Cholados El Oasis'}
              </h1>

              {/* Botón interactivo de Me Gusta (Heart Toggle) */}
              <button
                id="store-detail-like-btn"
                onClick={onToggleLike}
                className={`p-2.5 rounded-full transition-all shrink-0 flex items-center justify-center active:scale-90 ${
                  isLiked
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm'
                    : 'bg-black/5 hover:bg-black/10'
                }`}
                style={{ color: textColor }}
                title={isLiked ? 'Quitar Me Gusta' : 'Dar Me Gusta'}
                aria-label="Dar o quitar Me Gusta"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? '#FF2A5F' : 'none'}>
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    stroke={isLiked ? '#FF2A5F' : 'currentColor'}
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>

            {/* Dirección */}
            <div className="flex items-center gap-2 text-base sm:text-lg font-medium" style={{ color: textColor }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="shrink-0 opacity-80">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                  fill="currentColor"
                />
              </svg>
              <span className="opacity-90">{store.address || 'Cra 83c #16-05, El Ingenio'}</span>
            </div>

            {/* Contador de Me Gusta */}
            <div className="flex items-center gap-2 font-semibold text-sm" style={{ color: textColor }}>
              <svg width="15" height="13" viewBox="0 0 12 10" fill="none">
                <path
                  d="M6 9.5C6 9.5 0.5 5.8 0.5 2.8C0.5 1.3 1.7 0.5 3 0.5C4.2 0.5 5.3 1.2 6 2C6.7 1.2 7.8 0.5 9 0.5C10.3 0.5 11.5 1.3 11.5 2.8C11.5 5.8 6 9.5 6 9.5Z"
                  fill={isLiked ? '#FF2A5F' : '#FFD166'}
                />
              </svg>
              <span className="opacity-90">{store.likes} Me Gusta</span>
            </div>

            {/* Descripción completa */}
            <p className="text-xs sm:text-sm leading-relaxed font-normal opacity-85" style={{ color: textColor }}>
              {store.descripcion ||
                'Un increíble lugar para tardear con tu familia, amigos, compañeros o cualquier persona que esté dispuesta a probar los postres más dulces de Cali. Un excelente ambiente con juego, recreaciones y actividades para todos los miembros de la familia.'}
            </p>

            {/* Sección Productos */}
            <div className="flex flex-col gap-3 mt-1">
              <h2
                className="text-xl sm:text-2xl font-semibold tracking-tight"
                style={{
                  color: textColor,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Productos
              </h2>

              {/* Lista de productos elegidos en la terminal */}
              <div className="grid grid-cols-3 gap-2.5">
                {displayProducts.map((product, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center rounded-[14px] p-2 shadow-xs border transition-shadow group"
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderColor: `${textColor}30`,
                    }}
                  >
                    <div className="w-full aspect-[4/3] rounded-[8px] overflow-hidden bg-black/10 mb-1.5">
                      <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span
                      className="text-xs font-medium text-center line-clamp-1 opacity-90"
                      style={{ color: textColor }}
                    >
                      {product.nombre}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón Como Llegar */}
            <div className="flex justify-center mt-2 pt-1">
              <button
                id="store-detail-directions-btn"
                onClick={handleDirections}
                className="w-full sm:w-auto px-7 py-3 rounded-[18px] font-medium text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95 shadow-md"
                style={{
                  backgroundColor: textColor,
                  color: backgroundColor === '#FFFFFF' || backgroundColor.toLowerCase() === '#fff' ? '#FFFFFF' : backgroundColor,
                  boxShadow: `0px 4px 12px ${textColor}35`,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"
                    fill="currentColor"
                  />
                </svg>
                <span>Como llegar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(-24px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default StoreDetail
