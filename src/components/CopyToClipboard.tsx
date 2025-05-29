"use client"

import { cn } from "@/utils/data/utils"
import { Copy } from "lucide-react"
import { useState } from "react"

interface CopyToClipboardProps {
  text: string
  message?: string
}

export default function CopyToClipboard({
  text,
  message = "Texto copiado al portapapeles",
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false)

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Error al copiar:", err)
    }
  }

  return (
    <button
      onClick={copyText}
      aria-label="Copiar al portapapeles"
      className="rounded hover:bg-gray-100 transition-colors"
    >
      <Copy
        className={cn("w-4 h-4", copied ? "text-green-500" : "text-gray-500")}
      />
    </button>
  )
}
