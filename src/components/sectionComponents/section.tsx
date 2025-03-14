import React from "react"
import { Card, CardContent } from "../ui/card"

type SectionProps = {
  title: string
  children: React.ReactNode
}

export function Section({ title, children }: SectionProps): JSX.Element | null {
  // Convertimos children a un array para poder iterarlo
  const childrenArray = React.Children.toArray(children)

  // Verificamos si algún Info tiene un value con contenido
  const hasValues = childrenArray.some((child) => {
    if (React.isValidElement(child) && child.props.value) {
      return child.props.value.trim() !== "" // Chequea si value no está vacío
    }
    return false
  })

  // Si no hay valores, retornamos null para no renderizar nada
  if (!hasValues) {
    return null
  }

  return (
    <Card className="w-full mb-3">
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-roboto font-semibold text-sm text-gray-400 mb-3">
            {title}
          </h3>
          <div className="space-y-1">{children}</div>
        </div>
      </CardContent>
    </Card>
  )
}
