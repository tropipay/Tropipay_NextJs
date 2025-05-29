"use client"

import { useToast } from "@/hooks/useToast"
import { useTranslations } from "@/utils/intl"
import { cn } from "@/utils/data/utils"
import { Copy } from "lucide-react"
import { useState } from "react"

interface CopyToClipboardProps {
  text: string | number | bigint | true
  messages?: any
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
        duration: 3000,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Error",
        description: messagesToUse?.error,
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <Copy
      onClick={(e) => copyText(e)}
      className={cn(
        "cursor-pointer w-3 h-3",
        copied ? "text-green-500" : "text-gray-500"
      )}
    />
  )
}
