import {
  ClickableValue,
  TextToCopy,
} from "@/components/copyToClipboard/TextToCopy"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import React from "react"

type InfoProps = {
  label: string | React.ReactNode
  value: any
  icon?: React.ReactNode
  textToCopy?: string
  onValueClick?: (v: any) => void
  toolTipForValue?: React.ReactNode
  classNameForValue?: string
  toClipboard?: boolean
  toClipboardIconHidden?: boolean
}

export function RowDetailInfo({
  label,
  value,
  icon,
  textToCopy,
  onValueClick,
  toolTipForValue,
  toClipboard = false,
  toClipboardIconHidden = false,
  classNameForValue = "",
}: InfoProps): any {
  if (!value) return null

  return (
    <div className="antialiased flex items-center text-gray-700 font-roboto text-xs leading-5 tracking-tight">
      <span className="font-bold w-24 md:w-32">{label}</span>
      <span className="flex-1 flex justify-end gap-2 group">
        {toClipboard ? (
          <TextToCopy
            {...{
              value,
              textToCopy: textToCopy ?? value,
              onValueClick,
              toolTipForValue,
              ...(toClipboardIconHidden && {
                classNameIcon: "hidden",
                classNameForValue,
              }),
            }}
          />
        ) : onValueClick ? (
          toolTipForValue ? (
            <Tooltip>
              <TooltipTrigger>
                <ClickableValue value={value} onValueClick={onValueClick} />
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                <span className={classNameForValue}>{toolTipForValue}</span>
              </TooltipContent>
            </Tooltip>
          ) : (
            <ClickableValue value={value} onValueClick={onValueClick} />
          )
        ) : (
          value
        )}
        {icon}
      </span>
    </div>
  )
}
