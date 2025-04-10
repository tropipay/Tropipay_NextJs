import TropipayLogo from "../images/TropipayLogo"

interface Props {
  className?: string
}

export default function ReportHeader({ className }: Props) {
  return (
    <header
      className={`w-full text-left font-sans space-y-4 px-4 ${className || ""}`}
    >
      {/* Encabezado principal */}
      <div className="space-y-2 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          <TropipayLogo />
        </h1>

        {/* Sección de liquidación */}
        <div className="flex flex-col items-end">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
            Liquidación
          </h3>
          <p className="text-lg md:text-xl font-medium text-gray-700">
            2024/09/01 - 2024/09/30
          </p>
        </div>
      </div>

      {/* Línea divisoria */}
      <hr className="border-t-2 border-gray-300 my-4" />

      {/* Información de dirección */}
      <div className="space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
          TUAMBIA SL
        </h2>
        <div className="text-base md:text-lg text-gray-600 space-y-1">
          <div>Avenida Andes 17, esc. 6, planta 2, puerta C Madrid, España</div>
          <div className="font-medium">B19922293</div>
        </div>
      </div>
    </header>
  )
}
