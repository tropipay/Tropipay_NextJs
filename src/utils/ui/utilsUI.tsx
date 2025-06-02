import { toast } from "sonner"
import { CircleX, Info, TriangleAlert } from "lucide-react"

type IconMessageType = "info" | "warn" | "error"
const getIconMessageByType = (type: IconMessageType) => {
  switch (type) {
    case "error":
      return <CircleX className="mr-2 w-4 text-red-500" />
    case "warn":
      return <TriangleAlert className="mr-2 w-4 text-orange-500" />
    default:
      return <Info className="mr-2 w-4 text-[#20d8ba]" />
  }
}

export const toastMessage = (
  title: React.ReactNode,
  description: React.ReactNode,
  type: IconMessageType = "info"
) => {
  const icon = getIconMessageByType(type)

  toast(
    <div>
      <div className="w-full flex items-center">
        {icon}
        <span>{title}</span>
      </div>
      <div className="pl-6">{description}</div>
    </div>,
    {
      icon: icon,
    }
  )
}

/** Crea un objeto de error con mensaje personalizado para ser utilizado con el componente ErrorHandler
 * @param {string} Message
 * @returns {object} ErrorData
 */
export const errorGenerator = ({
  setErrorData,
  condition,
  message,
  type = "error",
}) => {
  if (condition) {
    setErrorData({
      response: {
        type: "VALIDATION_ERROR",
        code: "INVALID_CODE",
        message: "Invalid code",
        details: [],
        i18n: message,
      },
      type,
    })
    return true
  }
  return false
}
