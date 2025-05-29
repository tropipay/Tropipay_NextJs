"use client" // Indica que este es un componente del lado del cliente

import { cn } from "@/utils/data/utils"
import { useEffect, useState } from "react"

const SwipeAnimation = () => {
  const [isVisible, setIsVisible] = useState(true)
  useEffect(() => {
    const pathElement = document.querySelector<HTMLDivElement>(".path")
    const handIconElement = document.querySelector<HTMLDivElement>(".hand-icon")

    if (pathElement && handIconElement) {
      pathElement.style.animation = "swipe-dot 2s 0.5s infinite"
      handIconElement.style.animation = "swipe-hand 2s infinite"
    }
    const timeout = setTimeout(() => {
      setIsVisible(false)
    }, 4000)

    // Limpiar el timeout al desmontar el componente
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div
      className={cn(
        "absolute h-[110px] w-[120px] block left-[calc(50vw-120px)] top-[calc(50vh-120px)] z-10",
        isVisible ? "visible" : "hidden"
      )}
    >
      <div
        className="path w-5 h-5 absolute bg-indigo-300 bg-opacity-50 rounded-full top-7 left-20 invisible"
        style={{ visibility: "hidden" }}
      ></div>

      {/* Icono de la mano */}
      <div
        className="hand-icon relative bg-center bg-no-repeat w-24 h-24 bg-contain"
        style={{
          backgroundImage: "url('/images/hand.png')",
          transformOrigin: "52% 62%",
          position: "absolute",
          top: "10px",
          left: "12px",
          backgroundSize: "inherit",
        }}
      ></div>

      <style jsx>{`
        @keyframes swipe-hand {
          25% {
            transform: translate(20px) rotate(30deg);
          }
          50% {
            transform: translate(-20px) rotate(-15deg);
          }
          100% {
            transform: translate(0px) rotate(0);
          }
        }

        @keyframes swipe-dot {
          12% {
            visibility: visible;
            width: 40px;
          }
          25% {
            visibility: visible;
            transform: translate(-65px);
            width: 20px;
          }
          26% {
            visibility: hidden;
          }
        }
      `}</style>
    </div>
  )
}

export default SwipeAnimation
