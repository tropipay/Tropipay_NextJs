import React from "react"
import Lottie from "lottie-react"
import animationData from "./spinner.json"

const Spinner: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.1)", // Fondo semitransparente
        zIndex: 9998, // Un z-index menor que el spinner
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 9999,
          width: "300px",
          height: "300px",
        }}
      >
        <Lottie animationData={animationData} loop={true} />
      </div>
    </div>
  )
}

export default Spinner
