"use client"

import { setColumns } from "@/components/ui/table/SetColumn"
import { movementsScheduledColumnsDef } from "./movementsScheduledColumnsDef"

export const movementsScheduledColumns = setColumns(
  movementsScheduledColumnsDef
)
