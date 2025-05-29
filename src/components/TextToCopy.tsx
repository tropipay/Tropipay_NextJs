import CopyToClipboard from "@/components/CopyToClipboard"
import { useTranslations } from "@/utils/intl"
import React from "react"

type TextToCopyProps = {
  value: any
  textToCopy?: string
  className?: string
  messages?: {
    success: string
    error: string
  }
  translate?: boolean
}

export function TextToCopy({
  value,
  textToCopy,
  className,
  messages,
  translate = false,
}: TextToCopyProps) {
  const { t } = useTranslations()
  function getTextFromValue(value: any): string {
    if (typeof value === "string" || typeof value === "number") {
      return translate ? t(value.toString()) : value.toString()
    }
    if (React.isValidElement(value)) {
      const element = value as React.ReactElement
      return getTextFromValue(element.props.children)
    }
    if (Array.isArray(value)) {
      return value.map(getTextFromValue).join("")
    }
    return ""
  }

  const textToCopyToUse = textToCopy && translate ? t(textToCopy) : textToCopy

  return (
    <span
      className={`px-2 hover:bg-gray-100 rounded flex items-center gap-1 group ${
        className || ""
      }`}
    >
      {value}
      <span className="hidden opacity-0 group-hover:block group-hover:opacity-100 transition-opacity">
        <CopyToClipboard
          text={textToCopyToUse || getTextFromValue(value)}
          messages={messages}
        />
      </span>
    </span>
  )
}
