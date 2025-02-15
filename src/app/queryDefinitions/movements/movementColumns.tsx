"use client"

import {
  movementsState,
  movementsStateGroups,
  movementTypes,
  paymentMethods,
} from "@/app/filterDefinitions/definitions"
import { setColumn } from "@/components/table/setColumn"
import { Checkbox } from "@/components/ui/checkbox"
import React from "react"

function capitalizeText(text: string) {
  if (!text) return ""
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const movementColumns: CustomColumnDef<Movement>[] = [
  setColumn("select", {
    type: "select",
    enableHiding: false,
    enableSorting: false,
  }),
  setColumn("amount", {
    type: "amount",
    enableHiding: false,
  }),
  setColumn("state", {
    type: "facetedBadge",
    optionList: movementsState,
    optionListGroups: movementsStateGroups,
    enableHiding: false,
  }),
  setColumn("valueDate", {
    type: "date",
    title: "date",
    enableHiding: false,
  }),
  setColumn("movementType", {
    title: "type",
    type: "faceted",
    optionList: movementTypes,
    enableSorting: false,
  }),
  setColumn("paymentMethod", {
    title: "method",
    type: "faceted",
    optionList: paymentMethods,
  }),
  setColumn("sender", {
    title: "user",
    type: "simpleText",
  }),
  setColumn("reference", {
    type: "simpleText",
  }),
]
