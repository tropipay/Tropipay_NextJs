import React, { useEffect, useState } from "react"
import { CheckCircle2, AlertCircle, Info, Loader2 } from "lucide-react"
import ContentHeader from "./contentHeader"
import Buttons from "./buttons"
import Spinner from "@/components/Spinner"

/**
 * Props para el componente SimplePage
 * @param title - Título a mostrarse
 * @param description - Descripción a mostrarse (pre-traducido, puede contener HTML)
 * @param icon - Icono a mostrarse ('ok', 'info', 'error', 'progress' o un componente React)
 * @param children - Contenido adicional
 * @param classIcon - Clases Tailwind adicionales para el icono
 * @param classChildren - Clases Tailwind adicionales para el contenedor del children
 * @param classTitle - Clases Tailwind adicionales para el título
 * @param className - Clases Tailwind adicionales para el contenedor principal
 * @param classDescription - Clases Tailwind adicionales para la descripción
 * @param buttonAProps - Props para el botón A (compatibles con shadcn/ui Button)
 * @param buttonBProps - Props para el botón B (compatibles con shadcn/ui Button)
 * @param buttonAText - Label del botón A (pre-traducido)
 * @param buttonBText - Label del botón B (pre-traducido)
 * @param buttonADisabled - Deshabilitar botón A
 * @param buttonBDisabled - Deshabilitar botón B
 * @param loading - Estado de carga (afecta botones)
 * @param buttonAAction - Acción del botón A
 * @param buttonBAction - Acción del botón B
 * @param buttonsDisposition - Disposición de botones ('vertical' | 'horizontal')
 * @param spinner - Mostrar spinner overlay durante la carga
 */
interface SimplePageProps {
  title?: string | null
  description?: string | null
  icon?: "ok" | "info" | "error" | "progress" | React.ReactNode
  children?: React.ReactNode
  classIcon?: string
  classChildren?: string
  classTitle?: string
  className?: string
  classDescription?: string
  buttonAProps?: ButtonsComponentProps["buttonAProps"]
  buttonBProps?: ButtonsComponentProps["buttonBProps"]
  buttonAText?: string
  buttonBText?: string
  buttonADisabled?: boolean
  buttonBDisabled?: boolean
  loading?: boolean
  buttonAAction?: ButtonsComponentProps["buttonAAction"]
  buttonBAction?: ButtonsComponentProps["buttonBAction"]
  buttonsDisposition?: ButtonsComponentProps["buttonsDisposition"]
  spinner?: boolean
}

import type { ButtonsComponentProps } from "./buttons"

const SimplePage: React.FC<SimplePageProps> = ({
  title = null,
  description = null,
  icon = "ok",
  children = null,
  classIcon = "mt-3 pt-5",
  classChildren = "",
  classTitle = "",
  className = "",
  classDescription = "",
  buttonAProps = {},
  buttonBProps = {},
  buttonAText = "",
  buttonBText = "",
  buttonADisabled = false,
  buttonBDisabled = false,
  loading = false,
  buttonAAction,
  buttonBAction,
  buttonsDisposition = "vertical",
  spinner = false,
}) => {
  const iconMap = {
    ok: CheckCircle2,
    info: Info,
    error: AlertCircle,
    progress: Loader2,
  }

  let IconComponent: React.ElementType | null = null
  if (typeof icon === "string" && iconMap[icon]) {
    IconComponent = iconMap[icon]
  } else if (React.isValidElement(icon)) {
    IconComponent = () => icon
  } else if (typeof icon === "function") {
    IconComponent = icon
  }

  const containerClasses = `flex flex-col p-4 ${className}`

  const iconColorClass =
    icon === "ok"
      ? "text-green-500"
      : icon === "error"
      ? "text-red-500"
      : icon === "info"
      ? "text-blue-500"
      : "text-gray-500"

  const iconClasses = `h-16 w-16 ${iconColorClass} ${classIcon} ${
    icon === "progress" ? "animate-spin" : ""
  }`

  return (
    <div className={containerClasses}>
      {IconComponent && (
        <div className="flex justify-center text-center mb-4">
          <IconComponent className={iconClasses} />
        </div>
      )}
      <ContentHeader
        title={title}
        subtitle={description}
        classNameTitle={classTitle}
        classNameSubtitle={classDescription}
      />
      {loading && spinner && <Spinner />}
      {!!children && (
        <div className={`flex-grow ${classChildren}`}>{children}</div>
      )}
      <Buttons
        buttonAProps={buttonAProps}
        buttonBProps={buttonBProps}
        buttonAText={buttonAText}
        buttonBText={buttonBText}
        buttonAAction={buttonAAction}
        buttonBAction={buttonBAction}
        buttonsDisposition={buttonsDisposition}
        buttonADisabled={buttonADisabled}
        buttonBDisabled={buttonBDisabled}
        loading={loading}
        className="mt-auto pt-4"
      />
    </div>
  )
}

export default SimplePage
