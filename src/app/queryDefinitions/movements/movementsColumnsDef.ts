import {
  movementsState,
  movementsStateGroups,
  movementTypes,
  paymentMethods,
} from "@/app/filterDefinitions/definitions"

export const movementColumnsDef: any = {
  select: {
    type: "select",
    enableHiding: false,
    enableSorting: false,
  },
  amount: {
    type: "amount",
    enableHiding: false,
    showFilter: true,
  },
  destinationAmount: {
    type: "amount",
    hidden: true,
  },
  commission: {
    type: "amount",
    addSign: false,
    filter: false,
    hidden: true,
  },
  state: {
    type: "facetedBadge",
    optionList: movementsState,
    optionListGroups: movementsStateGroups,
    enableHiding: false,
    showFilter: true,
  },
  completedAt: {
    type: "date",
    enableHiding: false,
    hidden: true,
  },
  createdAt: {
    type: "date",
    showFilter: true,
    size: 120,
  },
  movementType: {
    type: "faceted",
    showFilter: true,
    optionList: movementTypes,
    enableSorting: false,
    size: 200,
  },
  paymentMethod: {
    type: "faceted",
    optionList: paymentMethods,
    size: 220,
  },
  sender: {
    type: "simpleText",
    hidden: true,
  },
  reference: {
    type: "simpleText",
    hidden: true,
  },
  bankOrderCode: {
    type: "simpleText",
  },
  exchangeRate: {
    type: "simpleText",
    filter: false,
    hidden: true,
  },
  recipient: {
    type: "simpleText",
    hidden: true,
  },
  movementDirection: {
    type: "simpleText",
    hidden: true,
  },
}
