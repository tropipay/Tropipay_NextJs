"use client"

import { useEffect, useState } from "react"

const SwipeAnimation: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true)

  // Efecto para iniciar las animaciones y ocultar el componente después de 3 segundos
  useEffect(() => {
    const pathElement = document.querySelector<HTMLDivElement>(".path")
    const handIconElement = document.querySelector<HTMLDivElement>(".hand-icon")

    if (pathElement && handIconElement) {
      pathElement.style.animation = "swipe-dot 2s 0.5s infinite"
      handIconElement.style.animation = "swipe-hand 2s infinite"
    }

    // Ocultar el componente después de 3 segundos
    const timeout = setTimeout(() => {
      setIsVisible(false)
    }, 300000)

    // Limpiar el timeout al desmontar el componente
    return () => clearTimeout(timeout)
  }, [])

  if (!isVisible) return null // No renderizar si no es visible

  return (
    <div
      className="swipe relative flex items-center justify-center w-full h-full left-[45vw] top-[45vh]"
      style={{ position: "absolute" }}
    >
      <div
        className="path w-5 h-5 absolute bg-opacity-50 bg-indigo-300 rounded-full top-7 left-20"
        style={{ visibility: "hidden" }}
      ></div>
      <div
        className="hand-icon w-24 h-24 relative bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/593527-200.png')`,
          transformOrigin: "52% 62%",
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
