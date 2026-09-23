interface DessertItem {
  id: string
  name: string
  image: string
  hasGradient?: boolean
}

const DESIRED_DESSERTS: DessertItem[] = [
  {
    id: 'cholado',
    name: 'Cholado',
    image: '/figma/18714511a4b6ed16c96997a9c8a048cbc5993232.png',
  },
  {
    id: 'aborrajado',
    name: 'Aborrajado',
    image: '/figma/8e9a32ac8405841c6c5fab35297bf652fbcdbef3.png',
    hasGradient: true,
  },
  {
    id: 'merengon',
    name: 'Merengón',
    image: '/figma/0fd44c4b98d30d4a5da945e551b32bed914fcebe.png',
    hasGradient: true,
  },
  {
    id: 'lulada',
    name: 'Lulada',
    image: '/figma/e6fb42896433e9286f0abed9abd4d1db53c872f0.png',
    hasGradient: true,
  },
]

function DessertCard({ dessert }: { dessert: DessertItem }) {
  return (
    <div className="flex flex-col items-center group cursor-pointer w-full max-w-[362px]">
      <div className="relative w-full aspect-square rounded-[36px] overflow-hidden bg-slate-100 shadow-md group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300">
        <img
          src={dessert.image}
          alt={dessert.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {dessert.hasGradient && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        )}
      </div>
      <p className="mt-6 text-2xl md:text-[30px] font-medium text-black tracking-tight group-hover:text-[#534cf4] transition-colors text-center">
        {dessert.name}
      </p>
    </div>
  )
}

export default function DesiredDessertsSection() {
  return (
    <section id="postres" className="w-full py-20 md:py-28 bg-[#fbfbfb]">
      <div className="max-w-[1728px] mx-auto px-6 md:px-28">
        {/* Cabecera de Sección (Frame 6) */}
        <div className="flex flex-col items-start gap-2 mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-[72px] font-semibold text-[#534cf4] leading-tight tracking-tight">
            Postres más deseados
          </h2>
          <p className="text-lg md:text-[24px] text-[#171717] font-normal">
            Los postres que más le han gustado al público
          </p>
        </div>

        {/* Grilla de los 4 postres (Group 68, 67, 66, 65) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 justify-items-center">
          {DESIRED_DESSERTS.map((dessert) => (
            <DessertCard key={dessert.id} dessert={dessert} />
          ))}
        </div>
      </div>
    </section>
  )
}
