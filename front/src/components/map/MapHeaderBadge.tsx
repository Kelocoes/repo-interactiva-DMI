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
      className="group relative flex items-center justify-center gap-3 bg-[#FBFBFB] hover:bg-white text-neutral-800 transition-all duration-300 rounded-[32px] md:rounded-[40px] px-6 md:px-8 py-3 md:py-4 cursor-pointer select-none border border-black/5"
      style={{
        boxShadow: '0px 4px 8px 0px rgba(73, 73, 73, 0.25)',
      }}
    >
      {onBackToHome && (
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 group-hover:bg-[#534CF4] group-hover:text-white text-neutral-600 transition-all duration-200 shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </span>
      )}
      <img
        src={bocaoLogo}
        alt="Boca'o - Lo más dulce del Valle"
        className="h-6 md:h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
      />
    </div>
  )
}

export default MapHeaderBadge
