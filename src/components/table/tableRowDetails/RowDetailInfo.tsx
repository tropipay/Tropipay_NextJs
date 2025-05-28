import CopyToClipboard from "@/components/CopyToClipboard"
import React from "react"

type InfoProps = {
  label: string | React.ReactNode
  value: any
  icon?: React.ReactNode
}

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

export function RowDetailInfo({ label, value, icon }: InfoProps): any {
  if (!value) return null
  const textToCopy = getTextFromValue(value)
  return (
    <div className="antialiased flex text-gray-700 font-roboto text-xs leading-5 tracking-tight">
      <span className="font-bold w-24 md:w-32">{label}</span>
      <span className="flex-1 flex justify-end gap-2 group">
        <span className="px-2 hover:bg-gray-100 rounded flex items-center gap-1">
          {value}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyToClipboard text={textToCopy} />
          </span>
        </span>
        {icon}
      </span>
    </div>
  )
}
