import cholado from "../../resources/cholado.png"
import manjarblanco from "../../resources/manjarblanco.png"
import cocadas from "../../resources/cocadas.png"

import { useEffect, useRef, useState } from "react"
import type { MouseEvent } from "react"

/**
 * rotate:     inclinación final (grados)
 * pileRotate: inclinación mientras está en el montón del centro
 * pileY:      qué tanto se asoma hacia abajo en el montón (px)
 * outStage:   etapa en la que la card queda en su lugar final
 *             (1 = ya está: es la que está encima del montón)
 * enterDelay: retraso (ms) al "repartirse" al montón, como una baraja
 * z:          orden dentro del montón (mayor = más arriba)
 */
const RECIPES = [
  { id: "cholado", image: cholado, rotate: -6, pileRotate: -9, pileY: 12, outStage: 2, enterDelay: 0, z: 2 },
  { id: "manjarblanco", image: manjarblanco, rotate: 0, pileRotate: 0, pileY: 0, outStage: 1, enterDelay: 260, z: 3 },
  { id: "cocadas", image: cocadas, rotate: 6, pileRotate: 9, pileY: 12, outStage: 3, enterDelay: 130, z: 1 },
]

/**
 * Momento (ms desde que la sección entra en pantalla) de cada etapa:
 *  etapa 1 -> las cards vuelan al centro y forman el montón
 *  etapa 2 -> la card izquierda sale disparada hacia su lado
 *  etapa 3 -> la card derecha sale disparada hacia su lado
 */
const STAGE_TIMES = [0, 1500, 2300]

/** Ancho máximo de cada card (px). Antes era 466. */
const CARD_MAX = 400

/** Cuánto se sobreponen las cards en desktop (0.16 = 16% de su ancho). */
const OVERLAP = 0.16

/* Detecta si estamos en desktop (lg de Tailwind = 1024px) */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return isDesktop
}

type Recipe = (typeof RECIPES)[number]

function RecipeCard({
  recipe,
  index,
  stage,
  isDesktop,
  offsetX,
  shiftX,
}: {
  recipe: Recipe
  index: number
  stage: number
  isDesktop: boolean
  offsetX: number
  shiftX: number
}) {
  const tiltRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const { image, rotate, pileRotate, pileY, outStage, enterDelay, z } = recipe

  let transform: string
  let opacity: number
  let delay = 0
  let settled: boolean

  if (isDesktop) {
    if (stage >= outStage) {
      // Posición final (con el desplazamiento para que se sobrepongan)
      transform = `translate(${shiftX}px, 0) rotate(${rotate}deg) scale(1)`
      opacity = 1
      settled = true
    } else if (stage >= 1) {
      // Montón en el centro (encima de la card del medio)
      transform = `translate(${offsetX}px, ${pileY}px) rotate(${pileRotate}deg) scale(0.94)`
      opacity = 1
      settled = false
    } else {
      // Antes de empezar: abajo, chiquita y girada, lista para "repartirse"
      transform = `translate(${offsetX}px, 180px) rotate(${pileRotate * 3}deg) scale(0.6)`
      opacity = 0
      settled = false
    }
    if (stage === 1) delay = enterDelay
  } else {
    // Móvil / tablet: suben con rebote, una tras otra
    settled = stage >= 1
    transform = settled
      ? `translate(0, 0) rotate(${rotate}deg) scale(1)`
      : `translate(0, 80px) rotate(${pileRotate * 2}deg) scale(0.9)`
    opacity = settled ? 1 : 0
    delay = settled ? index * 160 : 0
  }

  // Cuando todas ya están en su lugar, flotan suavemente
  const floating = isDesktop ? stage >= 3 : stage >= 1

  // Inclinación 3D siguiendo el mouse
  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${-py * 16}deg) rotateY(${px * 16}deg) translateY(-10px) scale(1.05)`
  }
  const handleLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = ""
  }

  return (
    <div
      className="w-full will-change-transform motion-reduce:transition-none"
      style={{
        maxWidth: CARD_MAX,
        transform,
        opacity,
        zIndex: hovered ? 10 : z,
        transition:
          "transform 1000ms cubic-bezier(0.22, 1.4, 0.36, 1), opacity 450ms ease-out",
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Flotado suave (cada card con su propio ritmo) */}
      <div
        className="recipe-float"
        style={{
          animation: floating
            ? `recipe-float ${4 + index * 0.7}s ease-in-out ${index * 0.5}s infinite`
            : "none",
        }}
      >
        {/* Tilt 3D con el mouse */}
        <div
          ref={tiltRef}
          onMouseEnter={() => setHovered(true)}
          onMouseMove={handleMove}
          onMouseLeave={() => {
            handleLeave()
            setHovered(false)
          }}
          style={{ transition: "transform 200ms ease-out" }}
        >
          <img
            src={image}
            alt="Receta valluna"
            className="w-full h-auto object-contain"
            style={{
              // La sombra crece cuando la card "aterriza" en su lugar
              filter: settled
                ? "drop-shadow(0 26px 26px rgba(83, 76, 244, 0.25))"
                : "drop-shadow(0 6px 8px rgba(0, 0, 0, 0.12))",
              transition: "filter 800ms ease-out",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default function AcclaimedRecipesSection() {
  const gridRef = useRef<HTMLDivElement>(null)
  const playing = useRef(false)

  const [stage, setStage] = useState(0) // 0 = nada, 1, 2, 3
  const [offsets, setOffsets] = useState<number[]>([0, 0, 0]) // hacia el centro
  const [shifts, setShifts] = useState<number[]>([0, 0, 0]) // solapamiento final
  const isDesktop = useIsDesktop()

  // Distancia entre el centro de una columna y la siguiente.
  // Se calcula con el ancho del grid y su gap, así el montón queda
  // SIEMPRE exactamente en el centro (columna del medio).
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const measure = () => {
      const gap = parseFloat(getComputedStyle(grid).columnGap) || 0
      const cellWidth = (grid.clientWidth - gap * 2) / 3
      const step = cellWidth + gap // distancia entre centros de columnas

      // Separación real entre centros de cards ya sobrepuestas
      const cardWidth = Math.min(CARD_MAX, cellWidth)
      const spacing = cardWidth * (1 - OVERLAP)
      const shift = Math.max(step - spacing, 0)

      setOffsets([step, 0, -step]) // izquierda/derecha -> centro (montón)
      setShifts([shift, 0, -shift]) // centro -> posición final sobrepuesta
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(grid)
    return () => ro.disconnect()
  }, [])

  // La animación se repite cada vez que la sección entra en pantalla
  useEffect(() => {
    const timers: number[] = []
    const clearTimers = () => {
      timers.forEach((t) => window.clearTimeout(t))
      timers.length = 0
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.25) {
          if (playing.current) return
          playing.current = true
          clearTimers()

          if (reduceMotion) {
            setStage(3)
            return
          }

          STAGE_TIMES.forEach((time, i) => {
            timers.push(window.setTimeout(() => setStage(i + 1), time))
          })
        } else if (!entry.isIntersecting) {
          // Salió por completo: reinicia para que se repita la próxima vez
          playing.current = false
          clearTimers()
          setStage(0)
        }
      },
      { threshold: [0, 0.25] }
    )

    if (gridRef.current) {
      observer.observe(gridRef.current)
    }

    return () => {
      observer.disconnect()
      clearTimers()
    }
  }, [])

  return (
    <section
      id="recetas"
      className="
      w-full
      pt-20
      pb-24
      bg-[#fbfbfb]
      overflow-hidden
      "
    >
      <style>{`
        @keyframes recipe-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .recipe-float { animation: none !important; }
        }
      `}</style>

      <div
        className="
        max-w-[1728px]
        mx-auto
        px-6
        md:px-28
        "
      >
        {/* TITULO */}
        <div
          className="
          flex
          flex-col
          items-start
          gap-1
          mb-16
          "
        >
          <span
            className="
            text-sm
            sm:text-base
            md:text-[18px]
            font-normal
            text-black
            "
          >
            Cultura Valluna
          </span>

          <h2
            className="
            text-2xl
            sm:text-3xl
            md:text-[40px]
            font-semibold
            text-[#534cf4]
            tracking-tight
            "
          >
            Recetas Aclamadas
          </h2>
        </div>

        {/* CARDS */}
        <div
          ref={gridRef}
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-12
          lg:gap-8
          justify-items-center
          items-center
          "
        >
          {RECIPES.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              index={index}
              stage={stage}
              isDesktop={isDesktop}
              offsetX={offsets[index] ?? 0}
              shiftX={shifts[index] ?? 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}