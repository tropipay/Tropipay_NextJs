"use client"

import { setColumns } from "@/components/ui/table/SetColumn"
import { movementsColumnsDef } from "./movementsColumnsDef"

export const movementsColumns = setColumns(movementsColumnsDef)
