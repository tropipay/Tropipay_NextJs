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
  valueTooltip?: React.ReactNode
}

type ClickableValueProps = {
  value: any
  onValueClick: (v: any) => void
}

export const ClickableValue: React.FC<ClickableValueProps> = ({
  value,
  onValueClick,
}) => {
  return (
    <span className="cursor-pointer" onClick={() => onValueClick(value)}>
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
  valueTooltip,
  onValueClick,
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
        valueTooltip ? (
          <Tooltip>
            <TooltipTrigger>
              <ClickableValue value={value} onValueClick={onValueClick} />
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              {valueTooltip}
            </TooltipContent>
          </Tooltip>
        ) : (
          <ClickableValue value={value} onValueClick={onValueClick} />
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
