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
    filterType: "list",
  }),
  setColumn("valueDate", {
    type: "date",
    title: "Value date",
    enableHiding: false,
    filterType: "date",
  }),
  setColumn("creationDate", {
    type: "date",
    title: "Creaction date",
    enableHiding: false,
    filterType: "date",
  }),
  setColumn("movementType", {
    title: "type",
    type: "faceted",
    optionList: movementTypes,
    enableSorting: false,
    filterType: "list",
  }),
  setColumn("paymentMethod", {
    title: "method",
    type: "faceted",
    optionList: paymentMethods,
    filterType: "list",
  }),
  setColumn("sender", {
    title: "user",
    type: "simpleText",
    filterType: "uniqueValue",
  }),
  setColumn("reference", {
    type: "simpleText",
    filterType: "uniqueValue",
  }),
  setColumn("bankOrderCode", {
    type: "simpleText",
    filterType: "uniqueValue",
  }),
  setColumn("exchangeRate", {
    type: "simpleText",
  }),
  setColumn("product", {
    type: "simpleText",
    filterType: "uniqueValue",
  }),
  setColumn("recipient", {
    type: "simpleText",
    filterType: "uniqueValue",
  }),
  setColumn("description", {
    type: "simpleText",
    filterType: "uniqueValue",
  }),
]
