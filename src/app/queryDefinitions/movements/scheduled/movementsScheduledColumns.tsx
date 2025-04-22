"use client"

import { setColumns } from "@/components/table/SetColumn"
import { movementsScheduledColumnsDef } from "./movementsScheduledColumnsDef"

export const movementsScheduledColumns = setColumns(
  movementsScheduledColumnsDef
)
