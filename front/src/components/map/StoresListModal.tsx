import React, { useState } from 'react'
import type { Store } from '../../services/storeService'
import btnPlus from '../../assets/interactive-map/btn_plus.svg'

interface StoresListModalProps {
  stores: Store[]
  onSelectStore: (store: Store) => void
  onClose: () => void
}

export const StoresListModal: React.FC<StoresListModalProps> = ({
  stores,
  onSelectStore,
  onClose,
}) => {
  // Inicialmente solo se muestran MÁXIMO 4 cards de las tiendas
  const [visibleCount, setVisibleCount] = useState<number>(4)

  const displayedStores = stores.slice(0, visibleCount)
  const hasMore = stores.length > visibleCount

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4)
  }

  return (
    <div
      id="stores-list-modal-container"
      className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 z-[1500] pointer-events-auto w-[calc(100vw-32px)] sm:w-[480px] md:w-[546px] max-w-[546px] h-[calc(100vh-32px)] sm:h-[calc(100vh-48px)] md:h-[calc(100vh-64px)] flex flex-col bg-[#FBFBFB] rounded-[28px] sm:rounded-[36px] md:rounded-[40px] border border-black/5 shadow-[0px_4px_18px_rgba(73,73,73,0.25)] select-none overflow-hidden animate-in fade-in slide-in-from-left duration-300"
    >
      {/* 1. Header con Título "Tiendas Disponibles" (#D600C4) y botón Cerrar */}
      <div className="pt-6 sm:pt-8 px-6 sm:px-9 pb-3 shrink-0">
        <div className="flex items-center justify-between gap-4">
          <h2
            className="text-2xl sm:text-3xl md:text-[34px] font-extrabold tracking-tight"
            style={{
              color: '#D600C4',
              fontFamily: "'Telegraf', 'Outfit', 'Plus Jakarta Sans', sans-serif",
            }}
          >
            Tiendas Disponibles
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar lista de tiendas"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-neutral-700 transition-all active:scale-95 shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Línea divisoria de Figma #D8D8D8 */}
        <div className="w-full h-[1.5px] bg-[#D8D8D8] mt-4" />
      </div>

      {/* 2. Lista de Cards con Scroll */}
      <div className="flex-1 overflow-y-auto custom-popup-scroll px-6 sm:px-9 py-4 space-y-4">
        {displayedStores.length > 0 ? (
          displayedStores.map((store) => (
            <div
              key={store.id}
              onClick={() => onSelectStore(store)}
              className="w-full h-[113px] bg-white sm:bg-[#FBFBFB] hover:bg-white rounded-[16.7px] p-3 shadow-[0px_4px_12px_rgba(73,73,73,0.12)] hover:shadow-[0px_6px_20px_rgba(73,73,73,0.2)] transition-all cursor-pointer flex items-center gap-3.5 border border-black/[0.04] group shrink-0"
            >
              {/* Imagen Miniatura */}
              <div className="w-[106px] h-[75px] rounded-[16.7px] overflow-hidden shrink-0 bg-neutral-200">
                <img
                  src={store.bannerPreview || '/figma/store_banner_oasis.png'}
                  alt={store.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Datos de la Tienda */}
              <div className="flex flex-col justify-center min-w-0 flex-1">
                <h4 className="font-semibold text-[16px] sm:text-[16.7px] text-black truncate leading-tight mb-1">
                  {store.nombre}
                </h4>
                <p className="text-[13px] sm:text-[14px] text-[#AFAFAF] truncate mb-2">
                  {store.address}
                </p>
                <div className="flex items-center gap-1.5 text-[13px] text-[#AFAFAF] font-medium">
                  <svg
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="none"
                    className="shrink-0"
                  >
                    <path
                      d="M8 12.5C8 12.5 1.5 8.2 1.5 4.6C1.5 2.7 3.0 1.5 4.7 1.5C6.1 1.5 7.3 2.4 8 3.3C8.7 2.4 9.9 1.5 11.3 1.5C13.0 1.5 14.5 2.7 14.5 4.6C14.5 8.2 8 12.5 8 12.5Z"
                      stroke="#534CF4"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{store.likes} Me Gusta</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-neutral-400 text-sm font-normal">
            No se encontraron tiendas que coincidan con la búsqueda.
          </div>
        )}

        {/* 3. Botón con un '+' para ver el resto, cargando por grupos de 4 tiendas */}
        {hasMore && (
          <div className="flex justify-center pt-2 pb-4">
            <button
              type="button"
              onClick={handleLoadMore}
              title="Cargar más tiendas"
              aria-label="Cargar más tiendas"
              className="transition-transform hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
            >
              <img
                src={btnPlus}
                alt="Ver más tiendas"
                className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default StoresListModal
