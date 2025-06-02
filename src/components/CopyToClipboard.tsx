"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { cn } from "@/utils/data/utils"
import { useTranslations } from "@/utils/intl"
import { Copy } from "lucide-react"
import { useState } from "react"
import { FormattedMessage } from "react-intl"
import { toast } from "sonner"

interface CopyToClipboardProps {
  text: string | number | bigint | true
  messages?: {
    success: string
    error: string
  }
  toast?: any
}

export default function CopyToClipboard({
  text,
  messages,
}: CopyToClipboardProps) {
  const { t } = useTranslations()
  const [copied, setCopied] = useState(false)

  const messagesToUse = messages || {
    success: t("CopyToClipboardSuccess"),
    error: t("CopyToClipboardError"),
  }

  const copyText = async (event: React.MouseEvent) => {
    event.stopPropagation()
    try {
      await navigator.clipboard.writeText(text.toLocaleString())
      setCopied(true)
      toast.success(messagesToUse?.success, { duration: 2000 })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error(messagesToUse?.error, { duration: 2000 })
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Copy
          onClick={(e) => copyText(e)}
          className={cn(
            "cursor-pointer w-4 h-4",
            copied ? "text-green-500" : "text-gray-500"
          )}
        />
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="center"
        className="normal-case font-normal text-sm"
      >
        <FormattedMessage id="copy" />
      </TooltipContent>
    </Tooltip>
  )
}
