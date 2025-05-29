import CopyToClipboard from "@/components/CopyToClipboard"
import { TextToCopy } from "@/components/TextToCopy"
import React from "react"

type InfoProps = {
  label: string | React.ReactNode
  value: any
  icon?: React.ReactNode
  textToCopy?: string
}

export function RowDetailInfo({
  label,
  value,
  icon,
  textToCopy,
}: InfoProps): any {
  if (!value) return null
  return (
    <div className="antialiased flex text-gray-700 font-roboto text-xs leading-5 tracking-tight">
      <span className="font-bold w-24 md:w-32">{label}</span>
      <span className="flex-1 flex justify-end gap-2 group">
        <TextToCopy value={value} textToCopy={textToCopy || value} />
        {icon}
      </span>
    </div>
  )
}
