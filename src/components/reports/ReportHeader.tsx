import { cn } from "@/utils/data/utils"
import { FormattedMessage } from "react-intl"
import TropipayLogo from "../images/TropipayLogo"

interface Props {
  className?: string
  startDate: string
  endDate: string
}

export default function ReportHeader({
  className = "",
  startDate,
  endDate,
}: Props) {
  return (
    <header className={cn("w-full text-sm text-left font-sans", className)}>
      {/* Encabezado principal */}
      <div className="space-y-2 flex items-center justify-between">
        <h1 className="text-sm font-bold text-gray-900">
          <TropipayLogo />
        </h1>

        {/* Sección de liquidación */}
        <div className="flex flex-col items-end">
          <h3 className="font-bold text-gray-900">
            <FormattedMessage id="settlement" />
          </h3>
          <p className=" font-medium text-gray-700">
            {startDate} - {endDate}
          </p>
        </div>
      </div>

      {/* Línea divisoria */}
      <hr className="border-t-2 border-gray-300 my-1" />

      {/* Información de dirección */}
      <div className="space-y-1 mb-4">
        <h2 className="font-semibold text-gray-800">TUAMBIA SL</h2>
        <div className=" text-gray-600">
          <div>Avenida Andes 17, esc. 6, planta 2, puerta C Madrid, España</div>
          <div className="font-medium">B19922293</div>
        </div>
      </div>
    </header>
  )
}
