import { Button, Input } from "@/components/ui"
import React, { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"

interface InputAmountProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onChange?: (value: string) => void // Prop que se ejecutará tras el cambio
  maxValue?: number // Máximo permitido en centavos
  amount?: number | string // Valor inicial en centavos o formateado
  placeholder?: string // Propiedad placeholder
  action?: "clear" | "max" // Acción a realizar al hacer clic en el botón
}

const InputAmount: React.FC<InputAmountProps> = (props) => {
  const {
    onChange,
    maxValue = -1,
    className = "",
    amount,
    value,
    id,
    placeholder = "",
    action = "clear",
    ...rest
  } = props

  const [internalValue, setInternalValue] = useState(
    formatter(amount ?? (value as string | number) ?? "")
  )

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(formatter(value.toString()))
    }
  }, [value])

  // Función para formatear el valor en formato decimal
  function formatter(input: string | number) {
    if (input === "") return ""
    const isNegative = String(input).startsWith("-")
    const absoluteValue = String(input).replace("-", "")

    const cents = parseInt(absoluteValue, 10) || 0
    const formattedValue = (cents / 100).toFixed(2)

    return isNegative ? `-${formattedValue}` : formattedValue
  }

  // Manejar cambios en el input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value

    // Validar caracteres no numéricos (excepto el signo negativo al principio)
    if (!/^-?\d*\.?\d*$/.test(rawValue)) return

    // Extraer el signo negativo y el valor numérico
    const isNegative = rawValue.startsWith("-")
    const numericValue = rawValue.replace(/[^\d]/g, "")

    // Convertir a número y validar contra el máximo permitido
    const currentValue = parseInt(numericValue, 10)
    const currentMax = Math.round(maxValue)

    if (maxValue < 0 || Math.abs(currentValue) <= currentMax) {
      const formattedValue = formatter(
        isNegative ? `-${numericValue}` : numericValue.toString()
      )
      setInternalValue(formattedValue)

      // Notificar al componente padre con el valor formateado
      if (onChange) {
        onChange(formattedValue)
      }
    }
  }

  // Manejar el clic en el botón de borrar
  const handleClear = () => {
    setInternalValue("") // Borrar el valor
    if (onChange) {
      onChange("") // Notificar al componente padre
    }
  }

  const handleMax = () => {
    setInternalValue(formatter(maxValue))
    if (onChange) {
      onChange(formatter(maxValue))
    }
  }

  return (
    <div className="relative">
      <Input
        type="text"
        id={id} // Asigna el id si se proporciona
        inputMode="numeric"
        value={internalValue} // Valor controlado
        onChange={handleChange} // Manejar cambios
        className={`text-right ${className} ${
          internalValue ? "pr-[62px]" : ""
        }`} // Agregar padding-right cuando hay un valor
        placeholder={internalValue ? "" : placeholder} // Mostrar placeholder solo si no hay valor
        {...rest}
      />
      {action === "clear" &&
        internalValue && ( // Mostrar el botón solo si hay un valor
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 pb-[2px] w-[50px]"
            onClick={handleClear}
          >
            <FormattedMessage id="clear" />
          </Button>
        )}
      {action === "max" && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 pb-[2px] w-[50px]"
          onClick={handleMax}
        >
          <FormattedMessage id="max" />
        </Button>
      )}
    </div>
  )
}

export default InputAmount
