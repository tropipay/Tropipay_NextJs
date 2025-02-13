import {
  movementsState,
  movementTypes,
  paymentMethods,
} from "@/app/filterDefinitions/definitions"

export const movementsFilters = [
  {
    type: "amount",
    column: "amount",
    label: "amount",
  },
  {
    type: "list",
    column: "state",
    label: "state",
    options: movementsState,
  },
  {
    type: "date",
    column: "valueDate",
    label: "date",
  },
  {
    type: "list",
    column: "movementType",
    label: "type",
    options: movementTypes,
  },
  {
    type: "list",
    column: "paymentMethod",
    label: "method",
    options: paymentMethods,
  },
  {
    type: "uniqueValue",
    column: "sender",
    label: "user",
    placeHolder: "user",
  },
  {
    type: "uniqueValue",
    column: "reference",
    label: "reference",
    placeHolder: "reference",
  },
]
