import CopyToClipboard from "@/components/CopyToClipboard"
import React from "react"

type TextToCopyProps = {
  value: any
  textToCopy?: string
  className?: string
}

export function TextToCopy({ value, textToCopy, className }: TextToCopyProps) {
  function getTextFromValue(value: any): string {
    if (typeof value === "string" || typeof value === "number") {
      return value.toString()
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

  return (
    <span
      className={`px-2 hover:bg-gray-100 rounded flex items-center gap-1 group ${
        className || ""
      }`}
    >
      {value}
      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyToClipboard text={textToCopy || getTextFromValue(value)} />
      </span>
    </span>
  )
}
