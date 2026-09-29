import React, { useState } from 'react'
import { Search, X } from 'lucide-react'

interface MapSearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export const MapSearchBar: React.FC<MapSearchBarProps> = ({
  onSearch,
  placeholder = 'Busca tu tienda favorita...',
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchTerm(val)
    if (onSearch) onSearch(val)
  }

  const handleClear = () => {
    setSearchTerm('')
    if (onSearch) onSearch('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) onSearch(searchTerm)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center bg-[#FBFBFB] border border-black/5 rounded-full px-2.5 md:px-3.5 py-1.5 md:py-2 transition-all duration-300 w-full max-w-[440px] md:max-w-[480px] shadow-md ${className}`}
      style={{
        boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.12)',
      }}
    >
      <div className="relative flex items-center w-full bg-black/[0.03] rounded-full px-3.5 md:px-4 py-1.5 md:py-2 transition-colors focus-within:bg-black/[0.05]">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-neutral-800 placeholder-[#888888] text-sm md:text-base font-normal outline-none pr-7 font-sans"
        />

        {searchTerm ? (
          <button
            type="button"
            onClick={handleClear}
            className="text-neutral-400 hover:text-neutral-700 p-0.5 transition-colors"
            title="Borrar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <span className="text-[#888888] p-0.5 pointer-events-none shrink-0">
            <Search className="w-4 md:w-5 h-4 md:h-5" strokeWidth={2.2} />
          </span>
        )}
      </div>
    </form>
  )
}

export default MapSearchBar
