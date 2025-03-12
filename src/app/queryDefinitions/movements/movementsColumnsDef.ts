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
  createdAt: {
    type: "date",
    showFilter: true,
    size: 120,
    field: "createdAt",
    order: 0,
  },
  amountCharged: {
    type: "amount",
    showFilter: true,
    field: `amountCharged {
              value
              currency
            }`,
    order: 1,
  },
  state: {
    type: "facetedBadge",
    optionList: movementsState,
    optionListGroups: movementsStateGroups,
    enableHiding: false,
    showFilter: true,
    field: "state",
    order: 2,
  },
  movementType: {
    type: "faceted",
    showFilter: true,
    optionList: movementTypes,
    enableSorting: false,
    size: 200,
    field: "movementType",
    order: 4,
  },
  concept: {
    type: "simpleText",
    showFilter: true,
    field: `concept`,
    order: 5,
  },
  bankOrderCode: {
    type: "simpleText",
    field: "bankOrderCode",
    order: 6,
  },
  reference: {
    type: "simpleText",
    hidden: true,
    field: "reference",
  },
  email: {
    type: "simpleText",
    hidden: true,
    field: `email`,
  },
  completedAt: {
    type: "date",
    enableHiding: false,
    hidden: true,
    field: "completedAt",
  },
  amount: {
    type: "amount",
    enableHiding: false,
    hidden: true,
    field: `amount {
              value
              currency
            }`,
  },
  fee: {
    type: "amount",
    hidden: true,
    field: `fee {
              value
              currency
            }`,
  },
  conversionRate: {
    type: "simpleText",
    hidden: true,
    field: `conversionRate`,
  },
  paymentMethod: {
    type: "faceted",
    optionList: paymentMethods,
    hidden: true,
    size: 220,
    field: "paymentMethod",
  },
  sender: {
    type: "simpleText",
    field: "sender",
    order: 3,
  },
  recipient: {
    type: "simpleText",
    field: "recipient",
    hidden: true,
  },
  summary: {
    type: "simpleText",
    field: "summary",
    hidden: true,
  },
  cardPan: {
    type: "simpleText",
    field: "cardPan",
    hidden: true,
  },
  exchangeRate: {
    type: "simpleText",
    filter: false,
    hidden: true,
    field: "exchangeRate",
  },
  movementDirection: {
    type: "simpleText",
    hidden: true,
    field: "movementDirection",
  },
}
