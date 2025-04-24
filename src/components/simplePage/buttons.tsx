import React from "react"
import { Button, type ButtonProps } from "@/components/ui/Button"
import { Loader2 } from "lucide-react"

export interface ButtonsComponentProps {
  // Añadir export
  buttonAProps?: ButtonProps
  buttonBProps?: ButtonProps
  buttonAText?: string
  buttonBText?: string
  buttonADisabled?: boolean
  buttonBDisabled?: boolean
  loading?: boolean
  buttonAAction?: React.MouseEventHandler<HTMLButtonElement>
  buttonBAction?: React.MouseEventHandler<HTMLButtonElement>
  buttonsDisposition?: "vertical" | "horizontal"
  className?: string
}

const Buttons: React.FC<ButtonsComponentProps> = ({
  buttonAProps = {},
  buttonBProps = {},
  buttonAText = "",
  buttonBText = "",
  buttonADisabled = false,
  buttonBDisabled = false,
  loading = false,
  buttonAAction,
  buttonBAction,
  buttonsDisposition = "horizontal",
  className = "",
}) => {
  if (!buttonAText && !buttonBText) return null

  // Extraer props conocidas con defaults seguros
  const {
    variant: variantA = "default",
    type: typeA = "submit",
    className: classNameA = "",
    size: sizeA = "lg",
    ...restAProps
  } = buttonAProps
  const {
    variant: variantB = "secondary",
    type: typeB = "button",
    className: classNameB = "",
    size: sizeB = "lg",
    ...restBProps
  } = buttonBProps

  // Validar tipos y variantes contra los permitidos por ButtonProps
  // (TypeScript debería inferir esto ahora, pero podemos validar explícitamente si es necesario)
  // Nota: La validación explícita puede ser redundante si los tipos son correctos.
  // Por simplicidad, confiaremos en la inferencia de tipos de ButtonProps por ahora.

  // Construir props finales para pasar al componente Button
  // Eliminar : ButtonProps para permitir data-* attributes
  const finalButtonAProps = {
    variant: variantA,
    type: typeA,
    size: sizeA,
    className: `${classNameA}`, // Removed w-full flex-1
    "data-test-id": "confirm-action",
    disabled: buttonADisabled || loading,
    onClick: buttonAAction,
    ...restAProps,
  }

  const finalButtonBProps = {
    variant: variantB,
    type: typeB,
    size: sizeB,
    className: `${classNameB}`, // Removed w-full flex-1
    "data-test-id": "cancel-action",
    disabled: buttonBDisabled || loading,
    onClick: buttonBAction,
    ...restBProps,
  }

  return (
    <div
      className={`flex pt-3 ${className} ${
        buttonsDisposition === "vertical"
          ? "flex-col gap-3"
          : "gap-4 flex-row-reverse"
      }`}
    >
      {!!buttonAText && (
        <Button {...finalButtonAProps} variant="default">
          {loading && <Loader2 className="mr-2 h-4 animate-spin w-auto" />}
          {!loading && buttonAText}
        </Button>
      )}
      <Button {...finalButtonBProps} variant="active">
        {loading && <Loader2 className="mr-2 h-4 animate-spin" />}
        {!loading && buttonBText}
      </Button>
    </div>
  )
}

export default Buttons
