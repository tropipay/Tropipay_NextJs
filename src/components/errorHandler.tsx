import React, { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"

interface ErrorHandlerProps {
  errors: Array<string | Error | { message: string }>
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ errors }) => {
  const [isOpen, setIsOpen] = useState(true)

  const formatErrors = (errors: ErrorHandlerProps["errors"]) => {
    console.log("...............")
    return errors
      .map((error) => {
        if (typeof error === "string") return error
        if (error instanceof Error) return error.message
        return error.message || "Error desconocido"
      })
      .join("\n• ")
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Se han detectado errores</AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">
            Se encontraron los siguientes errores:
            {"\n\n• "}
            {formatErrors(errors)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setIsOpen(false)}>
            Entendido
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ErrorHandler
