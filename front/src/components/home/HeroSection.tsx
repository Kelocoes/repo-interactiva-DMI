interface HeroSectionProps {
  onOpenMap: () => void
}

export default function HeroSection({ onOpenMap }: HeroSectionProps) {
  return (
    <section
      id="inicio"
      className="relative w-full overflow-hidden bg-[#fbfbfb] pt-[72px]"
    >
      <div className="relative mx-auto flex min-h-[570px] w-full max-w-[1100px] flex-col items-center px-5">

        {/* TÍTULO */}
        <div className="relative z-20 mt-[26px] max-w-[650px] text-center">
          <h1 className="text-[38px] font-normal leading-[1.08] tracking-[-1.4px] text-black md:text-[43px]">
            Lo más dulce del Valle en
            <br />
            un solo{" "}
            <span className="font-telegraf relative inline-block font-black tracking-[-1px]">
              Boca’o

              {/* SUBRAYADO MORADO */}
              <img
                src="/figma/5026b122900bc1ac0c2a3cb1726f6176d5e6d9d3.svg"
                alt=""
                className="pointer-events-none absolute left-1/2 top-[92%] w-[115%] -translate-x-1/2"
              />
            </span>
          </h1>
        </div>

        {/* BOTONES */}
        <div className="relative z-20 mt-[28px] flex items-center justify-center gap-[12px]">
          <a
            href="#postres"
            className="flex h-[38px] w-[145px] items-center justify-center rounded-full border border-[#534cf4] text-[14px] font-medium text-[#534cf4] transition hover:bg-[#534cf4]/5"
          >
            Conocer Más
          </a>

          <button
            onClick={onOpenMap}
            className="flex h-[38px] w-[118px] items-center justify-center rounded-full bg-[#534cf4] text-[14px] font-medium text-white transition hover:bg-[#433cc7]"
          >
            Ver Mapa
          </button>
        </div>

        {/* CELULARES + ELEMENTOS DECORATIVOS */}
        <div className="relative z-10 mt-[38px] h-[510px] w-full max-w-[860px]">

          {/* DECORACIÓN MORADA IZQUIERDA */}
          <img
            src="/figma/8b4c77cd846abdce0161fb9df37e3fb43fdcd3d5.svg"
            alt=""
            className="pointer-events-none absolute left-[2px] top-[150px] z-0 w-[155px]"
          />

          {/* ESTRELLA AMARILLA DERECHA */}
          <img
            src="/figma/f4a59134c767cf4c05a7b98af1b8e703a04932aa.svg"
            alt=""
            className="pointer-events-none absolute right-[20px] top-[5px] z-0 w-[205px]"
          />

          {/* CELULARES */}
          <img
            src="/figma/305dee135c530c364d943438f640872189d67e8a.png"
            alt="Boca'o App"
            className="absolute left-1/2 top-[-50px] z-10 w-[1350px] max-w-none -translate-x-1/2 object-contain"
          />

          {/* DEGRADADO BLANCO INFERIOR */}
          <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[105px] w-[800px] -translate-x-1/2 bg-gradient-to-t from-[#fbfbfb] via-[#fbfbfb]/85 to-transparent" />

        </div>
      </div>
    </section>
  )
}