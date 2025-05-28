"use client"

import { useToast } from "@/hooks/useToast"
import { Copy } from "lucide-react"
import { useState } from "react"

interface CopyToClipboardProps {
  text: string | number | bigint | true
  message?: string
  toast?: any
}

export default function CopyToClipboard({
  text,
  message = "Texto copiado al portapapeles",
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false)

  const { toast } = useToast()

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text.toLocaleString())
      setCopied(true)
      toast({
        title: "Copiado",
        description: message,
        duration: 3000,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Error al copiar:", err)
      toast({
        title: "Error",
        description: "No se pudo copiar el texto",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <Copy
      onClick={copyText}
      className={`cursor-pointer w-3 h-3 ${
        copied ? "text-green-500" : "text-gray-500"
      }`}
    />
  )
}
