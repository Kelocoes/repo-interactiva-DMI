import React from 'react'
import type { Store } from '../../services/storeService'
import { Store as StoreIcon } from 'lucide-react'
import { assetUrl } from '../../utils/assets'

interface MapFixedStoresBarProps {
  /** Tiendas ordenadas por likes descendente */
  stores: Store[]
  onSelectStore: (store: Store) => void
  onOpenFullList: () => void
  className?: string
}

export const MapFixedStoresBar: React.FC<MapFixedStoresBarProps> = ({
  stores,
  onSelectStore,
  onOpenFullList,
  className = '',
}) => {
  // Para la pantalla principal del mapa, solo se muestran las cards de las 2 tiendas con más likes
  const displayStores = stores.slice(0, 2)

  return (
    <div
      id="fixed-stores-bar"
      className={`pointer-events-auto flex items-center gap-3 sm:gap-4 select-none ${className}`}
    >
      {/* Cards de las 2 tiendas con más likes fijas en el mapa */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto max-w-[calc(100vw-32px)] py-1">
        {displayStores.length > 0 ? (
          displayStores.map((store) => (
            <div
              key={store.id}
              onClick={() => onSelectStore(store)}
              className="w-[280px] sm:w-[312.5px] h-[113px] bg-[#FBFBFB] hover:bg-white rounded-[16.7px] p-3 shadow-[0px_4px_8px_rgba(73,73,73,0.25)] hover:shadow-[0px_6px_16px_rgba(73,73,73,0.3)] transition-all cursor-pointer flex items-center gap-3 border border-black/[0.04] group shrink-0"
            >
              {/* Imagen miniatura */}
              <div className="w-[106px] h-[75px] rounded-[16.7px] overflow-hidden shrink-0 bg-neutral-200">
                <img
                  src={store.bannerPreview || assetUrl('/figma/store_banner_oasis.png')}
                  alt={store.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Datos de la tienda */}
              <div className="flex flex-col justify-center min-w-0 flex-1">
                <h4 className="font-semibold text-[16px] sm:text-[16.7px] text-black truncate leading-tight mb-1">
                  {store.nombre}
                </h4>
                <p className="text-[13px] sm:text-[15.3px] text-[#AFAFAF] truncate mb-1.5">
                  {store.address}
                </p>
                <div className="flex items-center gap-1.5 text-[13px] text-[#AFAFAF] font-medium">
                  <svg
                    width="15"
                    height="13"
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
          <div className="h-[113px] px-6 bg-[#FBFBFB] rounded-[16.7px] flex items-center justify-center text-sm text-neutral-500 shadow-[0px_4px_8px_rgba(73,73,73,0.15)] border border-black/[0.04]">
            No se encontraron tiendas
          </div>
        )}
      </div>

      {/* Botón para ver la lista completa con icono de Store (lucide-react) — Siempre visible */}
      <button
        type="button"
        onClick={onOpenFullList}
        title="Ver lista completa de tiendas"
        aria-label="Ver lista completa de tiendas"
        className="shrink-0 w-[58px] h-[58px] sm:w-[72.8px] sm:h-[72.8px] rounded-full bg-[#FBFBFB] hover:bg-white text-neutral-800 hover:text-[#534CF4] transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none flex items-center justify-center cursor-pointer shadow-[0px_4px_8px_rgba(73,73,73,0.25)] hover:shadow-[0px_6px_16px_rgba(73,73,73,0.3)] border border-black/[0.04] group"
      >
        <StoreIcon
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 transition-transform duration-300 group-hover:scale-110"
          strokeWidth={2.1}
        />
      </button>
    </div>
  )
}

export default MapFixedStoresBar
