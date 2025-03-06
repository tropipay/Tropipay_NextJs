import {
  movementsState,
  movementsStateGroups,
  movementTypes,
  paymentMethods,
} from "@/app/filterDefinitions/definitions"

export const movementsColumnsDef: any = {
  /* select: {
    type: "select",
    enableHiding: false,
    enableSorting: false,
  }, */
  amount: {
    type: "amount",
    enableHiding: false,
    showFilter: true,
    field: `amount {
              value
              currency
            }`,
  },
  destinationAmount: {
    type: "amount",
    hidden: true,
    field: `destinationAmount {
              value
              currency
            }`,
  },
  commission: {
    type: "amount",
    addSign: false,
    filter: false,
    hidden: true,
    field: `commission {
              value
              currency
            }`,
  },
  state: {
    type: "facetedBadge",
    optionList: movementsState,
    optionListGroups: movementsStateGroups,
    enableHiding: false,
    showFilter: true,
    field: "state",
  },
  completedAt: {
    type: "date",
    enableHiding: false,
    hidden: true,
    field: "completedAt",
  },
  createdAt: {
    type: "date",
    showFilter: true,
    size: 120,
    field: "createdAt",
  },
  movementType: {
    type: "faceted",
    showFilter: true,
    optionList: movementTypes,
    enableSorting: false,
    size: 200,
    field: "movementType",
  },
  paymentMethod: {
    type: "faceted",
    optionList: paymentMethods,
    size: 220,
    field: "paymentMethod",
  },
  sender: {
    type: "simpleText",
    field: "sender",
  },
  reference: {
    type: "simpleText",
    hidden: true,
    field: "reference",
  },
  bankOrderCode: {
    type: "simpleText",
    field: "bankOrderCode",
  },
  exchangeRate: {
    type: "simpleText",
    filter: false,
    hidden: true,
    field: "exchangeRate",
  },
  recipient: {
    type: "simpleText",
    hidden: true,
    field: "recipient",
  },
  movementDirection: {
    type: "simpleText",
    hidden: true,
    field: "movementDirection",
  },
}
