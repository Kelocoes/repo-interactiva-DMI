import React, { useCallback, useMemo, useRef, useState } from 'react'
import { IceCreamBowl, Upload } from 'lucide-react'
import { POSTRE_CATALOG } from '../../constants/postresCatalog'


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
const MAX_IMAGE_SIZE_BYTES = 3 * 1024 * 1024 // 3 MB límite máximo

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

  // ── Cálculo del progreso general (Formulario + Terminal) ───────────────
  const completionStats = useMemo(() => {
    const checks = [
      { id: 'nombre', ok: form.nombre.trim() !== '' },
      { id: 'descripcion', ok: form.descripcion.trim() !== '' },
      { id: 'banner', ok: !!bannerPreview },
      { id: 'logo', ok: !!logoPreview },
      { id: 'colorTexto', ok: validColor1 },
      { id: 'colorFondo', ok: validColor2 },
      { id: 'postres', ok: validPostres },
    ]
    const completedCount = checks.filter((c) => c.ok).length
    const percentage = Math.round((completedCount / checks.length) * 100)
    return { completedCount, totalCount: checks.length, percentage }
  }, [
    form.nombre,
    form.descripcion,
    bannerPreview,
    logoPreview,
    validColor1,
    validColor2,
    validPostres,
  ])

  const [imageError, setImageError] = useState<string | null>(null)

  // ── Drag-and-drop helpers con validación de peso ───────────────────────
  const processSelectedFile = useCallback(
    (file: File, type: 'banner' | 'logo') => {
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
        setImageError(
          `El archivo "${file.name}" supera el límite de 3 MB (pesa ${sizeMb} MB). Por favor selecciona una imagen más liviana.`
        )
        return
      }

      setImageError(null)
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        if (type === 'banner') setBannerPreview(result)
        else setLogoPreview(result)
      }
      reader.readAsDataURL(file)
    },
    []
  )

  const handleFileDrop = useCallback(
    (type: 'banner' | 'logo') =>
      (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (!file) return
        processSelectedFile(file, type)
      },
    [processSelectedFile]
  )

  const handleFileInput = useCallback(
    (type: 'banner' | 'logo') =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        processSelectedFile(file, type)
      },
    [processSelectedFile]
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

          {/* Barra de progreso de campos completados (Formulario + Terminal) */}
          <TerminalProgressBar
            percentage={completionStats.percentage}
            completedCount={completionStats.completedCount}
            totalCount={completionStats.totalCount}
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
                  className="font-semibold leading-tight transition-colors duration-300 font-telegraf"
                  style={{
                    fontFamily: "'Telegraf', 'Outfit', 'Syne', sans-serif",
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
              {/* Alerta de archivo demasiado pesado */}
              {imageError && (
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm animate-in fade-in duration-200 shadow-xs">
                  <svg className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span className="flex-1 font-medium leading-snug">{imageError}</span>
                  <button
                    type="button"
                    onClick={() => setImageError(null)}
                    className="text-rose-400 hover:text-rose-700 p-0.5 font-bold cursor-pointer"
                    title="Cerrar aviso"
                  >
                    ✕
                  </button>
                </div>
              )}

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
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 select-none">
                            <IceCreamBowl className="w-8 h-8 text-gray-400 opacity-50" strokeWidth={1.75} />
                            <span
                              className="text-xs text-gray-400 font-medium"
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

interface TerminalProgressBarProps {
  percentage: number
  completedCount: number
  totalCount: number
}

/** Barra de progreso en la parte inferior del panel de la terminal */
const TerminalProgressBar: React.FC<TerminalProgressBarProps> = ({
  percentage,
  completedCount,
  totalCount,
}) => {
  const isComplete = percentage === 100

  return (
    <div
      className="shrink-0 flex flex-col justify-center px-6 py-3 gap-1.5"
      style={{ background: '#2018E9', borderRadius: '0 0 30px 30px' }}
    >
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "'Exo 2', monospace",
              color: '#D8D6FF',
              fontWeight: 500,
              fontSize: 12,
            }}
          >
            Progreso general
          </span>
          <span
            className="px-2 py-0.5 rounded text-[11px] font-semibold transition-colors duration-300"
            style={{
              background: isComplete ? 'rgba(52, 211, 153, 0.25)' : 'rgba(255, 178, 0, 0.2)',
              color: isComplete ? '#34D399' : '#FFD166',
              fontFamily: "'Exo 2', monospace",
            }}
          >
            {percentage}%
          </span>
        </div>

        <span
          className="text-[11px]"
          style={{
            fontFamily: "'Exo 2', monospace",
            color: isComplete ? '#34D399' : 'rgba(216, 214, 255, 0.7)',
          }}
        >
          {isComplete ? '¡Todos los campos completos!' : `${completedCount} de ${totalCount} completados`}
        </span>
      </div>

      {/* Barra de progreso visual */}
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(255, 255, 255, 0.15)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: isComplete
              ? 'linear-gradient(90deg, #10B981 0%, #34D399 100%)'
              : 'linear-gradient(90deg, #FFB200 0%, #D600C4 100%)',
            boxShadow: isComplete
              ? '0 0 8px rgba(52, 211, 153, 0.5)'
              : '0 0 8px rgba(214, 0, 196, 0.4)',
          }}
        />
      </div>
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
      <div className="flex flex-col items-center gap-3 select-none">
        <Upload
          className="w-8 h-8 transition-transform duration-200"
          style={{ color: accentColor, opacity: 0.6 }}
          strokeWidth={2}
        />
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
