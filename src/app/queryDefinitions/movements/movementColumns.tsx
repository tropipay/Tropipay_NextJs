"use client"

import {
  movementsState,
  movementsStateGroups,
  movementTypes,
  paymentMethods,
} from "@/app/filterDefinitions/definitions"
import { setColumn } from "@/components/table/setColumn"

function capitalizeText(text: string) {
  if (!text) return ""
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const movementColumns: any = [
  setColumn("select", {
    type: "select",
    enableHiding: false,
    enableSorting: false,
  }),
  setColumn("amount", {
    type: "amount",
    enableHiding: false,
    showFilter: true,
  }),
  setColumn("destinationAmount", {
    type: "amount",
    hidden: true,
  }),
  setColumn("commission", {
    type: "amount",
    addSign: false,
    filter: false,
    hidden: true,
  }),
  setColumn("state", {
    type: "facetedBadge",
    optionList: movementsState,
    optionListGroups: movementsStateGroups,
    enableHiding: false,
    showFilter: true,
  }),
  setColumn("completedAt", {
    type: "date",
    enableHiding: false,
  }),
  setColumn("createdAt", {
    type: "date",
  }),
  setColumn("movementType", {
    type: "faceted",
    optionList: movementTypes,
    enableSorting: false,
  }),
  setColumn("paymentMethod", {
    type: "faceted",
    optionList: paymentMethods,
  }),
  setColumn("sender", {
    type: "simpleText",
    hidden: true,
  }),
  setColumn("reference", {
    type: "simpleText",
    hidden: true,
  }),
  setColumn("bankOrderCode", {
    type: "simpleText",
    hidden: true,
  }),
  setColumn("exchangeRate", {
    type: "simpleText",
    filter: false,
    hidden: true,
  }),
  setColumn("recipient", {
    type: "simpleText",
    hidden: true,
  }),
]
