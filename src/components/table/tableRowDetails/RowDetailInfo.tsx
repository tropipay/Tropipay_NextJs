import { TextToCopy } from "@/components/TextToCopy"
import React from "react"

type InfoProps = {
  label: string | React.ReactNode
  value: any
  icon?: React.ReactNode
  textToCopy?: string
  onValueClick?: (v: any) => void
  valueTooltip?: React.ReactNode
}

export function RowDetailInfo({
  label,
  value,
  icon,
  textToCopy,
  onValueClick,
  valueTooltip,
}: InfoProps): any {
  if (!value) return null

  return (
    <div className="antialiased flex items-center text-gray-700 font-roboto text-xs leading-5 tracking-tight">
      <span className="font-bold w-24 md:w-32">{label}</span>
      <span className="flex-1 flex justify-end gap-2 group">
        <TextToCopy
          {...{ value, textToCopy: textToCopy ?? value, onValueClick, valueTooltip }}
        />
        {icon}
      </span>
    </div>
  )
}
