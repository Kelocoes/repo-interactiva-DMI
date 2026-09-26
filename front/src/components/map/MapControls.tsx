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
        className={`flex flex-col gap-2.5 pointer-events-auto ${className}`}
        aria-label="Controles de navegación del mapa"
      >
        <button
          type="button"
          onClick={onZoomIn}
          disabled={!canZoomIn}
          title={canZoomIn ? 'Acercar mapa' : 'Zoom máximo alcanzado'}
          className={`flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#FBFBFB] hover:bg-white text-[#555555] hover:text-black border border-black/5 transition-all duration-200 select-none active:scale-95 shadow-md ${
            !canZoomIn ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'
          }`}
          style={{
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.14)',
          }}
        >
          <Plus className="w-5 h-5 md:w-5.5 md:h-5.5" strokeWidth={2.5} />
        </button>

        <button
          type="button"
          onClick={onZoomOut}
          disabled={!canZoomOut}
          title={canZoomOut ? 'Alejar mapa' : 'Zoom mínimo alcanzado'}
          className={`flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#FBFBFB] hover:bg-white text-[#555555] hover:text-black border border-black/5 transition-all duration-200 select-none active:scale-95 shadow-md ${
            !canZoomOut ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'
          }`}
          style={{
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.14)',
          }}
        >
          <Minus className="w-5 h-5 md:w-5.5 md:h-5.5" strokeWidth={2.5} />
        </button>
      </div>

      {/* Explore Button (Bottom Right) */}
      {onExploreClick && (
        <button
          type="button"
          onClick={onExploreClick}
          title="Explorar tiendas"
          className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#FBFBFB] hover:bg-white text-black border border-black/5 transition-all duration-200 select-none active:scale-95 cursor-pointer hover:shadow-lg pointer-events-auto shadow-md"
          style={{
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.14)',
          }}
        >
          <ArrowRight className="w-5 h-5 md:w-5.5 md:h-5.5" strokeWidth={2.5} />
        </button>
      )}
    </>
  )
}

export default MapControls
