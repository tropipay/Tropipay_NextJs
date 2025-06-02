import CopyToClipboard from "@/components/CopyToClipboard"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { cn } from "@/utils/data/utils"
import { useTranslations } from "@/utils/intl"
import React from "react"

type TextToCopyProps = {
  value: any
  textToCopy?: string
  className?: string
  classNameIcon?: string
  messages?: {
    success: string
    error: string
  }
  translate?: boolean
  onValueClick?: (v: any) => void
  toolTipForValue?: React.ReactNode
  classNameForValue?: string
}

type ClickableValueProps = {
  value: any
  onValueClick: (v: any) => void
  classNameForValue?: string
}

export const ClickableValue: React.FC<ClickableValueProps> = ({
  value,
  onValueClick,
  classNameForValue,
}) => {
  return (
    <span
      className={cn("cursor-pointer", classNameForValue)}
      onClick={() => onValueClick(value)}
    >
      {value}
    </span>
  )
}

export function TextToCopy({
  value,
  textToCopy,
  className = "",
  classNameIcon = "",
  messages,
  translate = false,
  toolTipForValue,
  onValueClick,
  classNameForValue,
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
      className={`rounded flex items-center gap-1 group ${className || ""}`}
    >
      {onValueClick ? (
        toolTipForValue ? (
          <Tooltip>
            <TooltipTrigger>
              <ClickableValue {...{ value, onValueClick, classNameForValue }} />
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              {toolTipForValue}
            </TooltipContent>
          </Tooltip>
        ) : (
          <ClickableValue {...{ value, onValueClick, classNameForValue }} />
        )
      ) : (
        value
      )}
      <span
        className={cn(
          "opacity-15 group-hover:block group-hover:opacity-100 transition-opacity",
          classNameIcon
        )}
      >
        <CopyToClipboard
          text={textToCopyToUse || getTextFromValue(value)}
          messages={messages}
        />
      </span>
    </span>
  )
}
