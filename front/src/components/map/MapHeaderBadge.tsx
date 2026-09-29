import React from 'react'
import bocaoLogo from '../../assets/interactive-map/Bocao-Logo.svg'
import { ArrowLeft } from 'lucide-react'

interface MapHeaderBadgeProps {
  onBackToHome?: () => void
}

export const MapHeaderBadge: React.FC<MapHeaderBadgeProps> = ({ onBackToHome }) => {
  return (
    <div
      onClick={onBackToHome}
      role={onBackToHome ? 'button' : undefined}
      tabIndex={onBackToHome ? 0 : undefined}
      onKeyDown={(e) => {
        if (onBackToHome && (e.key === 'Enter' || e.key === ' ')) {
          onBackToHome()
        }
      }}
      title="Volver a la página principal"
      className="group relative flex items-center justify-center gap-2.5 bg-[#FBFBFB] hover:bg-white text-neutral-800 transition-all duration-300 rounded-full px-4 md:px-5 py-2 md:py-2.5 cursor-pointer select-none border border-black/5 shadow-md"
      style={{
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
      }}
    >
      {onBackToHome && (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-100 group-hover:bg-[#534CF4] group-hover:text-white text-neutral-600 transition-all duration-200 shrink-0">
          <ArrowLeft className="w-3.5 h-3.5" />
        </span>
      )}
      <img
        src={bocaoLogo}
        alt="Boca'o - Lo más dulce del Valle"
        className="h-5 md:h-6 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
      />
    </div>
  )
}

export default MapHeaderBadge
