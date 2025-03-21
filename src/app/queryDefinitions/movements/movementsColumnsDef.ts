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
    enableHiding: false,
    size: 120,
    field: "createdAt",
    order: 0,
  },
  amount: {
    type: "amount",
    enableHiding: false,
    showFilter: true,
    order: 1,
    field: `amount {
      value
      currency
      }`,
  },
  amountCharged: {
    type: "amount",
    hidden: true,
    field: `amountCharged {
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
    order: 2,
  },
  sender: {
    type: "simpleText",
    enableHiding: false,
    order: 3,
    field: "sender",
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
  product: {
    type: "simpleText",
    field: `product`,
    hidden: true,
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
    hidden: true,
    field: "completedAt",
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
    size: 220,
    hidden: true,
    field: "paymentMethod",
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
    render: (value: string) => `**** ${value}`,
  },
  movementDirection: {
    type: "simpleText",
    hidden: true,
    field: "movementDirection",
    meta: { hidden: true },
  },
  search: {
    type: "simpleText",
    hidden: true,
    field: "search",
    meta: { hidden: true },
  },
}
