import React, { useCallback, useRef, useState } from 'react'

/** Datos que se emiten al padre cuando el usuario guarda la tienda */
export interface StoreFormData {
  lat: number
  lng: number
  nombre: string
  descripcion: string
  bannerPreview: string | null
  logoPreview: string | null
  code?: string
}

interface StorePopupProps {
  /** Coordenadas del punto donde el usuario hizo click */
  lat: number
  lng: number
  /** Callback para cerrar el popup (botón X / overlay) */
  onClose: () => void
  /** Callback que se dispara al guardar; recibe los datos del formulario */
  onSave: (data: StoreFormData) => void
}

interface FormState {
  nombre: string
  descripcion: string
}

const StorePopup: React.FC<StorePopupProps> = ({ lat, lng, onClose, onSave }) => {
  const [form, setForm] = useState<FormState>({ nombre: '', descripcion: '' })
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const [code, setCode] = useState<string>(
    `// Boca'o Terminal v1.0\n// Configura los datos de tu tienda en JS\n\nconst storeConfig = {\n  lat: ${lat.toFixed(5)},\n  lng: ${lng.toFixed(5)},\n  active: true,\n};\n\nconsole.log("Tienda inicializada en Cali!");`
  )

  const bannerInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // ── Drag-and-drop helpers ─────────────────────────────────────────────────
  const handleFileDrop = useCallback(
    (type: 'banner' | 'logo') =>
      (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        if (type === 'banner') {
          setBannerPreview(url)
        } else {
          setLogoPreview(url)
        }
      },
    []
  )

  const handleFileInput = useCallback(
    (type: 'banner' | 'logo') =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        if (type === 'banner') {
          setBannerPreview(url)
        } else {
          setLogoPreview(url)
        }
      },
    []
  )

  const handleGuardar = () => {
    onSave({
      lat,
      lng,
      nombre: form.nombre,
      descripcion: form.descripcion,
      bannerPreview,
      logoPreview,
      code,
    })
  }

  // ── Evitar que clicks dentro del popup cierren el overlay ─────────────────
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation()

  return (
    /* ── Overlay oscuro ─────────────────────────────────────────────────── */
    <div
      id="store-popup-overlay"
      onClick={onClose}
      className="absolute inset-0 z-[2000] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.35)' }}
    >
      {/* ── Contenedor de los dos paneles ──────────────────────────────── */}
      <div
        onClick={stopPropagation}
        className="flex gap-4 shadow-2xl"
        style={{
          maxHeight: '82vh',
          maxWidth: '95vw',
          // Animación de entrada
          animation: 'popup-in 0.28s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      >

        {/* ══════════════════════════════════════════════════════════════
            PANEL IZQUIERDO — Terminal / Código
            Color principal: #5552F6 (azul-morado del Figma)
        ══════════════════════════════════════════════════════════════ */}
        <div
          id="popup-terminal-panel"
          className="flex flex-col overflow-hidden shadow-xl"
          style={{
            width: 680,
            minHeight: 500,
            background: '#5552F6',
            borderRadius: '30px',
          }}
        >
          {/* Barra de título estilo macOS */}
          <div
            className="relative flex items-center px-6 shrink-0"
            style={{
              height: 44,
              background: '#2018E9',
              borderRadius: '30px 30px 0 0',
            }}
          >
            {/* Dots */}
            <span className="w-3.5 h-3.5 rounded-full mr-2" style={{ background: '#D600C4' }} />
            <span className="w-3.5 h-3.5 rounded-full mr-2" style={{ background: '#FFB200' }} />
            <span className="w-3.5 h-3.5 rounded-full" style={{ background: '#534CF4' }} />

            {/* Título centrado dentro de la barra */}
            <span
              className="absolute inset-0 flex items-center justify-center text-sm font-medium pointer-events-none"
              style={{ color: '#D8D6FF', fontFamily: 'Inter, sans-serif' }}
            >
              Boca&apos;o Terminal
            </span>
          </div>

          {/* Editor interactivo de código JavaScript */}
          <TerminalCodeEditor code={code} onChange={setCode} />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            PANEL DERECHO — Formulario de tienda
            Color principal: #FFFFFF con acento #D600C4 / #5552F6
        ══════════════════════════════════════════════════════════════ */}
        <div
          id="popup-form-panel"
          className="flex flex-col bg-white overflow-hidden"
          style={{
            width: 704,
            maxHeight: '82vh',
            borderRadius: '40px',
          }}
        >
          {/* Contenedor scrolleable recortado dentro de las esquinas redondeadas */}
          <div className="flex-1 overflow-y-auto custom-popup-scroll">
            {/* Header del formulario */}
            <div className="px-12 pt-9 pb-4 shrink-0">
            {/* Fila título + botón cerrar */}
            <div className="flex items-start justify-between mb-1">
              <h2
                className="font-semibold leading-tight"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 32,
                  color: '#D600C4',
                  opacity: 0.8,
                }}
              >
                ¡Crea tu tienda!
              </h2>

              {/* Botón ✕ */}
              <button
                id="popup-close-btn"
                onClick={onClose}
                className="flex items-center justify-center rounded-full shrink-0 transition-opacity hover:opacity-75"
                style={{
                  width: 41,
                  height: 41,
                  background: '#5552F6',
                  marginTop: 6,
                }}
                aria-label="Cerrar"
              >
                {/* Ícono X (stroke blanco) */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 2L14 14M14 2L2 14"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <p
              className="text-sm"
              style={{ color: 'rgba(0,0,0,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Prepárate para compartir tus postres con la comunidad Boca&apos;o
            </p>
          </div>

          {/* ── Cuerpo del formulario ────────────────────────────────── */}
          <div className="flex-1 px-12 pb-8 flex flex-col gap-5">

            {/* Fila Banner + Logo ─────────────────────────────────── */}
            <div className="flex gap-4">
              {/* Banner */}
              <div className="flex-1 flex flex-col gap-2">
                <label
                  className="font-semibold text-xl"
                  style={{
                    color: 'rgba(0,0,0,0.8)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Banner
                </label>
                <UploadBox
                  preview={bannerPreview}
                  onDrop={handleFileDrop('banner')}
                  onClick={() => bannerInputRef.current?.click()}
                  inputRef={bannerInputRef}
                  onChange={handleFileInput('banner')}
                  id="banner-upload"
                />
              </div>

              {/* Logo */}
              <div className="flex-1 flex flex-col gap-2">
                <label
                  className="font-semibold text-xl"
                  style={{
                    color: 'rgba(0,0,0,0.8)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  Logo
                </label>
                <UploadBox
                  preview={logoPreview}
                  onDrop={handleFileDrop('logo')}
                  onClick={() => logoInputRef.current?.click()}
                  inputRef={logoInputRef}
                  onChange={handleFileInput('logo')}
                  id="logo-upload"
                />
              </div>
            </div>

            {/* Campo Nombre ───────────────────────────────────────── */}
            <FormField
              id="store-nombre"
              label="Nombre"
              placeholder="Elige un nombre para tu tienda"
              value={form.nombre}
              onChange={(v) => setForm((f) => ({ ...f, nombre: v }))}
            />

            {/* Campo Descripción ──────────────────────────────────── */}
            <FormField
              id="store-descripcion"
              label="Descripción"
              placeholder="Dale una descripción llamativa a tu tienda"
              value={form.descripcion}
              onChange={(v) => setForm((f) => ({ ...f, descripcion: v }))}
            />

            {/* Personalización ────────────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <span
                className="font-bold text-xl"
                style={{
                  color: 'rgba(0,0,0,0.8)',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Personalización
              </span>
              <p
                className="text-sm"
                style={{ color: '#808080', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Selecciona 2 colores en la terminal, usando los métodos .....
              </p>
            </div>

            {/* Postres ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3">
              <span
                className="font-bold text-xl"
                style={{
                  color: 'rgba(0,0,0,0.8)',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Postres
              </span>
              <p
                className="text-sm mb-1"
                style={{ color: 'rgba(0,0,0,0.8)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Selecciona tus 3 productos en la terminal
              </p>

              {/* Placeholders de postres */}
              <div className="flex gap-4">
                {['Postre 1', 'Postre 2', 'Postre 3'].map((label, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-2xl overflow-hidden"
                    style={{ height: 129, background: '#E8E8E8' }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <span
                        className="text-xs text-gray-400"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón Guardar ──────────────────────────────────────── */}
            <div className="flex justify-center mt-2">
              <button
                id="popup-guardar-btn"
                onClick={handleGuardar}
                className="transition-all hover:opacity-90 hover:scale-105 active:scale-95"
                style={{
                  background: '#534CF4',
                  color: '#fff',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 17,
                  fontWeight: 400,
                  padding: '9px 36px',
                  borderRadius: 26,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Keyframe de entrada */}
      <style>{`
        @keyframes popup-in {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);     }
        }
      `}</style>
    </div>
  )
}

// ── Sub-componentes ────────────────────────────────────────────────────────

interface UploadBoxProps {
  preview: string | null
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onClick: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  id: string
}

const UploadBox: React.FC<UploadBoxProps> = ({
  preview,
  onDrop,
  onClick,
  inputRef,
  onChange,
  id,
}) => (
  <div
    id={id}
    role="button"
    tabIndex={0}
    className="relative flex items-center justify-center cursor-pointer overflow-hidden transition-colors hover:bg-blue-50/60"
    style={{
      width: '100%',
      height: 178,
      borderRadius: 20,
      border: '1px dashed #534CF4',
      background: preview ? 'transparent' : '#fff',
    }}
    onDrop={onDrop}
    onDragOver={(e) => e.preventDefault()}
    onClick={onClick}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
  >
    {preview ? (
      <img
        src={preview}
        alt="preview"
        className="absolute inset-0 w-full h-full object-cover rounded-[20px]"
      />
    ) : (
      <div className="flex flex-col items-center gap-4 select-none">
        {/* Ícono de subida */}
        <svg width="27" height="32" viewBox="0 0 27 32" fill="none">
          <path
            d="M13.5 0L0 11H8.5V22H18.5V11H27L13.5 0Z"
            fill="#534CF4"
            fillOpacity="0.5"
          />
          <rect x="0" y="24" width="27" height="3" rx="1.5" fill="#534CF4" fillOpacity="0.5" />
          <rect x="0" y="29" width="27" height="3" rx="1.5" fill="#534CF4" fillOpacity="0.5" />
        </svg>
        <span
          className="text-center text-sm"
          style={{
            width: 149,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: '#534CF4',
            opacity: 0.5,
          }}
        >
          Escoge un archivo o arrástralo aquí
        </span>
      </div>
    )}

    <input
      ref={inputRef}
      id={`${id}-input`}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={onChange}
    />
  </div>
)

interface FormFieldProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
}

const FormField: React.FC<FormFieldProps> = ({ id, label, placeholder, value, onChange }) => (
  <div className="flex flex-col gap-2">
    <label
      htmlFor={id}
      className="font-semibold text-xl"
      style={{
        color: 'rgba(0,0,0,0.8)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {label}
    </label>
    <input
      id={id}
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full outline-none bg-transparent text-sm placeholder-black/40 focus:ring-0"
      style={{
        height: 40,
        borderRadius: 20,
        border: '1px solid rgba(0,0,0,0.1)',
        background: '#fff',
        paddingLeft: 22,
        paddingRight: 22,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 16,
        color: '#000',
      }}
    />
  </div>
)

interface TerminalCodeEditorProps {
  code: string
  onChange: (code: string) => void
}

const TerminalCodeEditor: React.FC<TerminalCodeEditorProps> = ({ code, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)

  const lines = code.split('\n')

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const target = e.currentTarget
      const start = target.selectionStart
      const end = target.selectionEnd
      const val = target.value
      const newCode = val.substring(0, start) + '  ' + val.substring(end)
      onChange(newCode)
      setTimeout(() => {
        if (target) {
          target.selectionStart = target.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  return (
    <div
      className="flex-1 flex overflow-hidden p-6 gap-3"
      style={{ fontFamily: "'Exo 2', 'Fira Code', 'Courier New', monospace" }}
    >
      {/* Columna de números de línea sincronizada */}
      <div
        ref={lineNumbersRef}
        className="select-none text-right overflow-hidden opacity-40 text-white font-mono text-base leading-6 shrink-0"
        style={{ width: 28, paddingTop: 2 }}
      >
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      {/* Área de texto interactivo para escribir JavaScript */}
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        className="flex-1 bg-transparent text-white font-mono text-base leading-6 outline-none resize-none custom-popup-scroll border-none p-0 m-0"
        style={{
          caretColor: '#FFB200',
          whiteSpace: 'pre',
          tabSize: 2,
        }}
        placeholder="// Escribe código JavaScript aquí..."
      />
    </div>
  )
}

export default StorePopup

