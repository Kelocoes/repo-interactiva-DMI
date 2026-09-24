import cholado from "../../resources/cholado.png"
import manjarblanco from "../../resources/manjarblanco.png"
import cocadas from "../../resources/cocadas.png"

import { useEffect, useRef, useState } from "react"

const RECIPES = [
  {
    id: "cholado",
    image: cholado,
    rotate: "-rotate-[6deg]",
  },
  {
    id: "manjarblanco",
    image: manjarblanco,
    rotate: "",
  },
  {
    id: "cocadas",
    image: cocadas,
    rotate: "rotate-[6deg]",
  },
]


function RecipeCard({
  image,
  rotate,
  index,
}: {
  image: string
  rotate: string
  index: number
}) {

  const cardRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)


  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      {
        threshold: 0.2,
      }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()

  }, [])



  return (
    <div
      ref={cardRef}
      className={`
        w-full max-w-[466px]
        transition-all duration-700 ease-out
        ${rotate}
        ${visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-16"
        }
      `}
      style={{
        transitionDelay: `${index * 180}ms`
      }}
    >

      <img
        src={image}
        alt="Receta valluna"
        className="
          w-full
          h-auto
          object-contain
          transition-transform
          duration-500
          hover:scale-[1.03]
          hover:-translate-y-2
        "
      />

    </div>
  )
}



export default function AcclaimedRecipesSection() {


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

          {
            RECIPES.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                image={recipe.image}
                rotate={recipe.rotate}
                index={index}
              />
            ))
          }


        </div>


      </div>

    </section>

  )
}
