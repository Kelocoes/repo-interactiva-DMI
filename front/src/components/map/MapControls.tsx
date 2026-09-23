import React from 'react'
import { Plus, Minus, ArrowRight } from 'lucide-react'

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onExploreClick?: () => void
  canZoomIn?: boolean
  canZoomOut?: boolean
  className?: string
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onExploreClick,
  canZoomIn = true,
  canZoomOut = true,
  className = '',
}) => {
  return (
    <>
      {/* Zoom In & Zoom Out Controls */}
      <div
        className={`flex flex-col gap-4 pointer-events-auto ${className}`}
        aria-label="Controles de navegación del mapa"
      >
        <button
          type="button"
          onClick={onZoomIn}
          disabled={!canZoomIn}
          title={canZoomIn ? 'Acercar mapa' : 'Zoom máximo alcanzado'}
          className={`flex items-center justify-center w-14 h-14 md:w-[72px] md:h-[72px] rounded-full bg-[#FBFBFB] hover:bg-white text-[#757575] hover:text-black border border-black/5 transition-all duration-200 select-none active:scale-95 ${
            !canZoomIn ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'
          }`}
          style={{
            boxShadow: '0px 4px 8px 0px rgba(73, 73, 73, 0.25)',
          }}
        >
          <Plus className="w-7 h-7 md:w-8 md:h-8" strokeWidth={3} />
        </button>

        <button
          type="button"
          onClick={onZoomOut}
          disabled={!canZoomOut}
          title={canZoomOut ? 'Alejar mapa' : 'Zoom mínimo alcanzado'}
          className={`flex items-center justify-center w-14 h-14 md:w-[72px] md:h-[72px] rounded-full bg-[#FBFBFB] hover:bg-white text-[#757575] hover:text-black border border-black/5 transition-all duration-200 select-none active:scale-95 ${
            !canZoomOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'
          }`}
          style={{
            boxShadow: '0px 4px 8px 0px rgba(73, 73, 73, 0.25)',
          }}
        >
          <Minus className="w-7 h-7 md:w-8 md:h-8" strokeWidth={3} />
        </button>
      </div>

      {/* Explore Button (Bottom Right) */}
      {onExploreClick && (
        <button
          type="button"
          onClick={onExploreClick}
          title="Explorar tiendas"
          className="flex items-center justify-center w-14 h-14 md:w-[72px] md:h-[72px] rounded-full bg-[#FBFBFB] hover:bg-white text-black border border-black/5 transition-all duration-200 select-none active:scale-95 cursor-pointer hover:shadow-lg pointer-events-auto"
          style={{
            boxShadow: '0px 4px 8px 0px rgba(73, 73, 73, 0.25)',
          }}
        >
          <ArrowRight className="w-7 h-7 md:w-8 md:h-8" strokeWidth={3} />
        </button>
      )}
    </>
  )
}

export default MapControls
