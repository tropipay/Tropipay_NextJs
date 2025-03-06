"use client"

import { movementsColumnsDef } from "./movementsColumnsDef"
import { setColumns } from "@/components/table/setColumn"

function capitalizeText(text: string) {
  if (!text) return ""
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const movementsColumns = setColumns(movementsColumnsDef)
