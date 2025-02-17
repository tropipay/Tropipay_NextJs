import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input" // Ajusta el path según tu estructura de proyecto

interface InputAmountProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange?: (value: string) => void // Prop que se ejecutará tras el cambio
  maxValue?: number // Máximo permitido en centavos
  amount?: number | string // Valor inicial en centavos o formateado
  placeholder?: string // Propiedad placeholder
}

const InputAmount: React.FC<InputAmountProps> = ({
  onChange,
  maxValue = -1,
  className = "",
  amount,
  value,
  id,
  placeholder = "", // Valor predeterminado para placeholder
  ...rest // Captura cualquier otra prop del input
}) => {
  const [internalValue, setInternalValue] = useState(
    formater(amount || value || "")
  )

  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(formater(value))
    }
  }, [value])

  // Función para formatear el valor en formato decimal
  function formater(input: string | number) {
    if (input === "") return ""

    // Manejar números negativos
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
      const formattedValue = formater(
        isNegative ? `-${numericValue}` : numericValue
      )
      setInternalValue(formattedValue)

      // Notificar al componente padre con el valor formateado
      if (onChange) {
        onChange(formattedValue)
      }
    }
  }

  return (
    <Input
      type="text"
      id={id} // Asigna el id si se proporciona
      inputMode="numeric"
      value={internalValue} // Valor controlado
      onChange={handleChange} // Manejar cambios
      className={`text-right ${className}`} // Clases personalizadas
      placeholder={internalValue ? "" : placeholder} // Mostrar placeholder solo si no hay valor
      {...rest}
    />
  )
}

export default InputAmount
