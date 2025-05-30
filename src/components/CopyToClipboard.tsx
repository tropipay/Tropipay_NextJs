"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { useToast } from "@/hooks/useToast"
import { cn } from "@/utils/data/utils"
import { useTranslations } from "@/utils/intl"
import { Copy } from "lucide-react"
import { useState } from "react"
import { FormattedMessage } from "react-intl"

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
  const { toast } = useToast()

  const messagesToUse = messages || {
    success: t("CopyToClipboardSuccess"),
    error: t("CopyToClipboardError"),
  }

  const copyText = async (event: React.MouseEvent) => {
    event.stopPropagation()
    try {
      await navigator.clipboard.writeText(text.toLocaleString())
      setCopied(true)
      toast({
        description: messagesToUse?.success,
        duration: 2000,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: messagesToUse?.error,
        variant: "destructive",
        duration: 2000,
      })
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Copy
          onClick={(e) => copyText(e)}
          className={cn(
            "cursor-pointer w-3 h-3",
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
