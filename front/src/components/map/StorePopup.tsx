import React, { useCallback, useMemo, useRef, useState } from 'react'

// ── Catálogo de postres ────────────────────────────────────────────────────
// Cada postre tiene un código único alfanumérico de 6 dígitos que los
// estudiantes deben escribir en la terminal para seleccionarlo.
const POSTRE_CATALOG: Record<string, { nombre: string; imagen: string }> = {
  A2F4B1: { nombre: 'Manjar Blanco',            imagen: '/assets/postres/manjarBlanco.png' },
  C8D3E7: { nombre: 'Gelatina de Pata',          imagen: '/assets/postres/gelatinaDePata.png' },
  '9B1F6A': { nombre: 'Aborrajado Valluno Dulce', imagen: '/assets/postres/aborrajadoVallunoDulce.png' },
}

// ── Helpers de parseo ──────────────────────────────────────────────────────

/**
 * Busca en el código de la terminal el valor de una constante JS.
 * Ejemplo: parseConst("colorTexto", code) → "#5552F6"
 */
function parseConst(name: string, code: string): string | null {
  const re = new RegExp(
    `const\\s+${name}\\s*=\\s*["'\`]([^"'\`]+)["'\`]`,
    'i'
  )
  const m = code.match(re)
  return m ? m[1] : null
}

/**
 * Extrae los elementos del arreglo de misPostres del código.
 * Ejemplo: ["A2F4B1", "C8D3E7"] → ['A2F4B1', 'C8D3E7']
 */
function parsePostresArray(code: string): string[] {
  const re = /const\s+misPostres\s*=\s*\[([^\]]*)\]/i
  const m = code.match(re)
  if (!m) return []
  return m[1]
    .split(',')
    .map((s) => s.trim().replace(/["'`]/g, ''))
    .filter(Boolean)
}

/** Valida si un color hex es válido (#RGB o #RRGGBB) */
function isValidHex(color: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)
}

// ── Tipos ──────────────────────────────────────────────────────────────────

/** Datos que se emiten al padre cuando el usuario guarda la tienda */
export interface StoreFormData {
  lat: number
  lng: number
  nombre: string
  descripcion: string
  bannerPreview: string | null
  logoPreview: string | null
  color1: string
  color2: string
  postres: string[]
  code?: string
}

interface StorePopupProps {
  lat: number
  lng: number
  onClose: () => void
  onSave: (data: StoreFormData) => void
}

interface FormState {
  nombre: string
  descripcion: string
}

// ── Componente principal ───────────────────────────────────────────────────

const INITIAL_CODE = (_lat: number, _lng: number) =>
  `// Boca'o Terminal v1.0
// Configura los colores y postres de tu tienda con JavaScript`

const DEFAULT_COLOR1 = '#5552F6'
const DEFAULT_COLOR2 = '#FFFFFF'

const StorePopup: React.FC<StorePopupProps> = ({ lat, lng, onClose, onSave }) => {
  const [form, setForm] = useState<FormState>({ nombre: '', descripcion: '' })
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [code, setCode] = useState<string>(INITIAL_CODE(lat, lng))

  const bannerInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  // ── Parseo en vivo del código de la terminal ───────────────────────────
  const terminalColorTexto = useMemo(() => {
    const c = parseConst('colorTexto', code)
    return c && isValidHex(c) ? c : DEFAULT_COLOR1
  }, [code])

  const terminalColorFondo = useMemo(() => {
    const c = parseConst('colorFondo', code)
    return c && isValidHex(c) ? c : DEFAULT_COLOR2
  }, [code])

  const terminalPostres = useMemo(() => parsePostresArray(code), [code])

  // Colores "en vivo" que se muestran en el panel derecho
  const liveColor1 = terminalColorTexto
  const liveColor2 = terminalColorFondo

  // Los postres resueltos (solo los que existen en el catálogo)
  const resolvedPostres = useMemo(
    () => terminalPostres.map((c) => POSTRE_CATALOG[c] ?? null),
    [terminalPostres]
  )

  // ── Validación ──────────────────────────────────────────────────────────
  const rawColor1 = parseConst('colorTexto', code)
  const rawColor2 = parseConst('colorFondo', code)
  const validColor1 = rawColor1 ? isValidHex(rawColor1) : false
  const validColor2 = rawColor2 ? isValidHex(rawColor2) : false
  const validPostres =
    terminalPostres.length === 3 &&
    terminalPostres.every((c) => POSTRE_CATALOG[c] !== undefined)

  const isFormComplete =
    !!bannerPreview &&
    !!logoPreview &&
    form.nombre.trim() !== '' &&
    form.descripcion.trim() !== '' &&
    validColor1 &&
    validColor2 &&
    validPostres

  // ── Drag-and-drop helpers ──────────────────────────────────────────────
  const handleFileDrop = useCallback(
    (type: 'banner' | 'logo') =>
      (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        if (type === 'banner') setBannerPreview(url)
        else setLogoPreview(url)
      },
    []
  )

  const handleFileInput = useCallback(
    (type: 'banner' | 'logo') =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        if (type === 'banner') setBannerPreview(url)
        else setLogoPreview(url)
      },
    []
  )

  const handleGuardar = () => {
    if (!isFormComplete) return
    onSave({
      lat,
      lng,
      nombre: form.nombre,
      descripcion: form.descripcion,
      bannerPreview,
      logoPreview,
      color1: liveColor1,
      color2: liveColor2,
      postres: terminalPostres,
      code,
    })
  }

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div
      id="store-popup-overlay"
      onClick={onClose}
      className="absolute inset-0 z-[2000] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.35)' }}
    >
      <div
        onClick={stopPropagation}
        className="flex gap-4 shadow-2xl"
        style={{
          maxHeight: '82vh',
          maxWidth: '95vw',
          animation: 'popup-in 0.28s cubic-bezier(0.34,1.56,0.64,1) both',
        }}
      >

        {/* ══════════════════════════════════════════════════════════════
            PANEL IZQUIERDO — Terminal / Código
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
            style={{ height: 44, background: '#2018E9', borderRadius: '30px 30px 0 0' }}
          >
            <span className="w-3.5 h-3.5 rounded-full mr-2" style={{ background: '#D600C4' }} />
            <span className="w-3.5 h-3.5 rounded-full mr-2" style={{ background: '#FFB200' }} />
            <span className="w-3.5 h-3.5 rounded-full" style={{ background: '#534CF4' }} />
            <span
              className="absolute inset-0 flex items-center justify-center text-sm font-medium pointer-events-none"
              style={{ color: '#D8D6FF', fontFamily: 'Inter, sans-serif' }}
            >
              Boca&apos;o Terminal
            </span>
          </div>

          {/* Leyenda de ayuda */}
          <div
            className="shrink-0 px-6 pt-3 pb-1 text-xs leading-5"
            style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'Exo 2', monospace" }}
          >
            <span style={{ color: '#FFB200' }}>⚡</span> Edita las constantes de abajo — los cambios se reflejan al instante en la vista previa →
          </div>

          <TerminalCodeEditor code={code} onChange={setCode} />

          {/* Panel de estado: colores + postres válidos */}
          <StatusBar
            validColor1={validColor1}
            validColor2={validColor2}
            validPostres={validPostres}
            postresCount={terminalPostres.filter((c) => POSTRE_CATALOG[c]).length}
          />
        </div>

        {/* ══════════════════════════════════════════════════════════════
            PANEL DERECHO — Formulario (preview en vivo de colores)
        ══════════════════════════════════════════════════════════════ */}
        <div
          id="popup-form-panel"
          className="flex flex-col overflow-hidden transition-colors duration-300"
          style={{
            width: 704,
            maxHeight: '82vh',
            borderRadius: '40px',
            background: liveColor2,
          }}
        >
          <div className="flex-1 overflow-y-auto custom-popup-scroll">

            {/* Header */}
            <div className="px-12 pt-9 pb-4 shrink-0">
              <div className="flex items-start justify-between mb-1">
                <h2
                  className="font-semibold leading-tight transition-colors duration-300"
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 32,
                    color: liveColor1,
                    opacity: 0.85,
                  }}
                >
                  ¡Crea tu tienda!
                </h2>
                <button
                  id="popup-close-btn"
                  onClick={onClose}
                  className="flex items-center justify-center rounded-full shrink-0 transition-opacity hover:opacity-75"
                  style={{ width: 41, height: 41, background: '#5552F6', marginTop: 6 }}
                  aria-label="Cerrar"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 2L14 14M14 2L2 14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
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

            {/* ── Cuerpo del formulario ────────────────────────────── */}
            <div className="flex-1 px-12 pb-8 flex flex-col gap-5">

              {/* Fila Banner + Logo */}
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <label
                    className="font-semibold text-xl"
                    style={{ color: 'rgba(0,0,0,0.8)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
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
                    accentColor={liveColor1}
                  />
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <label
                    className="font-semibold text-xl"
                    style={{ color: 'rgba(0,0,0,0.8)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
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
                    accentColor={liveColor1}
                  />
                </div>
              </div>

              {/* Nombre */}
              <FormField
                id="store-nombre"
                label="Nombre"
                placeholder="Elige un nombre para tu tienda"
                value={form.nombre}
                onChange={(v) => setForm((f) => ({ ...f, nombre: v }))}
                accentColor={liveColor1}
              />

              {/* Descripción */}
              <FormField
                id="store-descripcion"
                label="Descripción"
                placeholder="Dale una descripción llamativa a tu tienda"
                value={form.descripcion}
                onChange={(v) => setForm((f) => ({ ...f, descripcion: v }))}
                accentColor={liveColor1}
              />

              {/* Personalización — preview de colores */}
              <div className="flex flex-col gap-2">
                <span
                  className="font-bold text-xl"
                  style={{ color: 'rgba(0,0,0,0.8)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Personalización
                </span>
                <div className="flex items-center gap-3">
                  {/* Muestra en vivo los dos colores elegidos */}
                  <ColorSwatch label="Texto" color={liveColor1} valid={validColor1} />
                  <ColorSwatch label="Fondo" color={liveColor2} valid={validColor2} />
                  <p
                    className="text-sm"
                    style={{ color: 'rgba(0,0,0,0.45)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Configura los colores en la terminal →
                  </p>
                </div>
              </div>

              {/* Postres */}
              <div className="flex flex-col gap-3">
                <span
                  className="font-bold text-xl"
                  style={{ color: 'rgba(0,0,0,0.8)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Postres
                </span>
                <p
                  className="text-sm mb-1"
                  style={{ color: 'rgba(0,0,0,0.5)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Selecciona tus 3 postres en la terminal usando los códigos del catálogo
                </p>

                {/* Tarjetas de postres (se llenan cuando el código es válido) */}
                <div className="flex gap-4">
                  {[0, 1, 2].map((i) => {
                    const postre = resolvedPostres[i]
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-2xl overflow-hidden relative"
                        style={{
                          height: 129,
                          background: postre ? 'transparent' : '#E8E8E8',
                          border: postre ? `2px solid ${liveColor1}` : '2px dashed #ccc',
                          transition: 'border-color 0.3s',
                        }}
                      >
                        {postre ? (
                          <>
                            <img
                              src={postre.imagen}
                              alt={postre.nombre}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div
                              className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs font-semibold text-center truncate"
                              style={{
                                background: 'rgba(0,0,0,0.55)',
                                color: '#fff',
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                              }}
                            >
                              {postre.nombre}
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                            <span className="text-2xl opacity-30">🍧</span>
                            <span
                              className="text-xs text-gray-400"
                              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                              Postre {i + 1}
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="flex justify-center mt-2">
                <button
                  id="popup-guardar-btn"
                  onClick={handleGuardar}
                  disabled={!isFormComplete}
                  className="transition-all"
                  style={{
                    background: isFormComplete ? liveColor1 : '#ccc',
                    color: '#fff',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 17,
                    fontWeight: 400,
                    padding: '9px 36px',
                    borderRadius: 26,
                    border: 'none',
                    cursor: isFormComplete ? 'pointer' : 'not-allowed',
                    opacity: isFormComplete ? 1 : 0.6,
                    transform: isFormComplete ? undefined : 'none',
                    transition: 'background 0.3s, opacity 0.3s',
                  }}
                  onMouseEnter={(e) => isFormComplete && ((e.target as HTMLElement).style.opacity = '0.85')}
                  onMouseLeave={(e) => isFormComplete && ((e.target as HTMLElement).style.opacity = '1')}
                >
                  {isFormComplete ? 'Guardar Cambios' : 'Completa todos los campos ↑'}
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

/** Muestra un círculo con el color elegido y un indicador de válido/inválido */
const ColorSwatch: React.FC<{ label: string; color: string; valid: boolean }> = ({
  label,
  color,
  valid,
}) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className="rounded-full transition-all duration-300"
      style={{
        width: 36,
        height: 36,
        background: valid ? color : '#eee',
        border: '2px solid rgba(0,0,0,0.75)',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
      }}
    />
    <span
      className="text-xs"
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: valid ? 'rgba(0,0,0,0.6)' : '#bbb',
      }}
    >
      {label}
    </span>
  </div>
)

/** Barra de estado en la parte inferior del panel de la terminal */
const StatusBar: React.FC<{
  validColor1: boolean
  validColor2: boolean
  validPostres: boolean
  postresCount: number
}> = ({ validColor1, validColor2, validPostres, postresCount }) => {
  const items = [
    { label: 'colorTexto', ok: validColor1 },
    { label: 'colorFondo', ok: validColor2 },
    { label: `postres (${postresCount}/3)`, ok: validPostres },
  ]
  return (
    <div
      className="shrink-0 flex gap-4 px-6 py-3"
      style={{ background: '#2018E9', borderRadius: '0 0 30px 30px' }}
    >
      {items.map(({ label, ok }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span style={{ fontSize: 12 }}>{ok ? '✅' : '⏳'}</span>
          <span
            style={{
              fontFamily: "'Exo 2', monospace",
              fontSize: 11,
              color: ok ? '#a5f3c8' : 'rgba(255,255,255,0.45)',
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}

interface UploadBoxProps {
  preview: string | null
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  onClick: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  id: string
  accentColor?: string
}

const UploadBox: React.FC<UploadBoxProps> = ({
  preview,
  onDrop,
  onClick,
  inputRef,
  onChange,
  id,
  accentColor = '#534CF4',
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
      border: `1px dashed ${accentColor}`,
      background: preview ? 'transparent' : 'rgba(255,255,255,0.6)',
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
        <svg width="27" height="32" viewBox="0 0 27 32" fill="none">
          <path d="M13.5 0L0 11H8.5V22H18.5V11H27L13.5 0Z" fill={accentColor} fillOpacity="0.5" />
          <rect x="0" y="24" width="27" height="3" rx="1.5" fill={accentColor} fillOpacity="0.5" />
          <rect x="0" y="29" width="27" height="3" rx="1.5" fill={accentColor} fillOpacity="0.5" />
        </svg>
        <span
          className="text-center text-sm"
          style={{
            width: 149,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            color: accentColor,
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
  accentColor?: string
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  accentColor = '#534CF4',
}) => (
  <div className="flex flex-col gap-2">
    <label
      htmlFor={id}
      className="font-semibold text-xl"
      style={{ color: 'rgba(0,0,0,0.8)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
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
        border: `1px solid ${accentColor}40`,
        background: 'rgba(255,255,255,0.7)',
        paddingLeft: 22,
        paddingRight: 22,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: 16,
        color: '#000',
        transition: 'border-color 0.3s',
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
      {/* Números de línea sincronizados */}
      <div
        ref={lineNumbersRef}
        className="select-none text-right overflow-hidden opacity-40 text-white font-mono text-base leading-6 shrink-0"
        style={{ width: 28, paddingTop: 2 }}
      >
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      {/* Área de texto */}
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
        style={{ caretColor: '#FFB200', whiteSpace: 'pre', tabSize: 2 }}
        placeholder="// Escribe código JavaScript aquí..."
      />
    </div>
  )
}

export default StorePopup
