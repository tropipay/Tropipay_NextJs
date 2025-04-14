import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui"
import React, { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

interface ErrorHandlerProps {
  errors: Array<string | Error | { message: string }>
  onOk?: () => void
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ errors, onOk }) => {
  const [isOpen, setIsOpen] = useState(true)

  const formatErrors = (errors: ErrorHandlerProps["errors"]) => {
    return errors
      .map((error) => {
        if (typeof error === "string") return error
        if (error instanceof Error) return error.message
        return error.message || "Error desconocido"
      })
      .join("\n• ")
  }

  const handlerOk = () => {
    setIsOpen(false)
    onOk?.()
  }

  useEffect(() => {
    if (errors.length > 0) {
      setIsOpen(true)
    }
  }, [errors])

  return (
    <AlertDialog open={isOpen && errors.length > 0} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <FormattedMessage
              id={
                errors.length === 1
                  ? "error_detected"
                  : "errors_have_been_detected"
              }
            />
          </AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">
            {formatErrors(errors)}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handlerOk}>
            <FormattedMessage id="got_it" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ErrorHandler
