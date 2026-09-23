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
      className={`relative flex items-center bg-[#FBFBFB] border border-black/5 rounded-[32px] md:rounded-[40px] px-3 md:px-5 py-2 md:py-3 transition-all duration-300 w-full max-w-[720px] ${className}`}
      style={{
        boxShadow: '0px 4px 8px 0px rgba(73, 73, 73, 0.25)',
      }}
    >
      <div className="relative flex items-center w-full bg-black/[0.02] rounded-[28px] md:rounded-[36px] px-4 md:px-6 py-2 md:py-3 transition-colors focus-within:bg-black/[0.04]">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent text-neutral-800 placeholder-[#999999] text-base md:text-[20px] font-normal outline-none pr-8 font-sans"
        />

        {searchTerm ? (
          <button
            type="button"
            onClick={handleClear}
            className="text-neutral-400 hover:text-neutral-700 p-1 transition-colors"
            title="Borrar búsqueda"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <span className="text-[#999999] p-1 pointer-events-none shrink-0">
            <Search className="w-5 md:w-6 h-5 md:h-6" strokeWidth={2.2} />
          </span>
        )}
      </div>
    </form>
  )
}

export default MapSearchBar
