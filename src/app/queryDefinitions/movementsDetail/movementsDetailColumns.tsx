"use client"

import { setColumns } from "@/components/table/setColumn"
import { movementsDetailColumnsDef } from "./movementsDetailColumnsDef"
import { movementsColumnsDef } from "../movements/movementsColumnsDef"

function capitalizeText(text: string) {
  if (!text) return ""
  return text.charAt(0).toUpperCase() + text.slice(1)
}
console.log("movementsDetailColumnsDef:", movementsDetailColumnsDef)
export const movementsDetailColumns = setColumns(movementsDetailColumnsDef)
