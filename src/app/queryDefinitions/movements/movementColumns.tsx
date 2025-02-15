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
  }),
  setColumn("destinationAmount", {
    type: "amount",
    enableHiding: false,
  }),
  setColumn("commission", {
    type: "amount",
    enableHiding: false,
    addSign: false,
  }),
  setColumn("state", {
    type: "facetedBadge",
    optionList: movementsState,
    optionListGroups: movementsStateGroups,
    enableHiding: false,
  }),
  setColumn("valueDate", {
    type: "date",
    title: "Value date",
    enableHiding: false,
  }),
  setColumn("creationDate", {
    type: "date",
    title: "Creaction date",
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
  setColumn("bankOrderCode", {
    type: "simpleText",
  }),
  setColumn("exchangeRate", {
    type: "simpleText",
  }),
  setColumn("product", {
    type: "simpleText",
  }),
  setColumn("recipient", {
    type: "simpleText",
  }),
  setColumn("description", {
    type: "simpleText",
  }),
]
