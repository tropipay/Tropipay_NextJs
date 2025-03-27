import { toast } from "@/hooks/use-toast"
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
  toast({
    // @ts-expect-error
    title: (
      <div className="w-full flex items-center">
        {getIconMessageByType(type)}
        <span>{title}</span>
      </div>
    ),
    description: <span className="pl-6">{description}</span>,
  })
}
