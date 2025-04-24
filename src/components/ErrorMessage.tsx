import { AlertTriangle } from "lucide-react"
import React, { ReactNode } from "react"

interface Props {
  children: ReactNode
}

const ErrorMessage: React.FC<Props> = ({ children }) => {
  return (
    <div className="w-full max-w-[500px] px-4">
      <div
        className="flex items-center justify-center bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded"
        role="alert"
      >
        <AlertTriangle className="w-6 h-6 mr-2" />
        <span>{children}</span>
      </div>
    </div>
  )
}

export default ErrorMessage
