import {
  movementsState,
  movementsStateGroups,
  movementTypes,
  paymentMethods,
} from "@/app/filterDefinitions/definitions"
import { hi } from "date-fns/locale"

export const movementsColumnsDef: any = {
  /* select: {
    type: "select",
    enableHiding: false,
    enableSorting: false,
  }, */
  reference: {
    type: "simpleText",
    hidden: true,
    field: "reference",
  },
  bankOrderCode: {
    type: "simpleText",
    field: "bankOrderCode",
    order: 6,
  },
  concept: {
    type: "simpleText",
    showFilter: true,
    field: `concept`,
    order: 5,
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
  email: {
    type: "simpleText",
    hidden: true,
    field: `email`,
  },
  createdAt: {
    type: "date",
    showFilter: true,
    enableHiding: false,
    size: 120,
    field: "createdAt",
    order: 0,
  },
  completedAt: {
    type: "date",
    hidden: true,
    field: "completedAt",
  },
  amount: {
    type: "amount",
    enableHiding: false,
    showFilter: true,
    field: `amount {
              value
              currency
            }`,
  },
  amountCharged: {
    type: "amount",
    hidden: true,
    showFilter: true,
    field: `amountCharged {
              value
              currency
            }`,
    order: 1,
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
  movementType: {
    type: "faceted",
    showFilter: true,
    optionList: movementTypes,
    enableSorting: false,
    size: 200,
    field: "movementType",
    order: 4,
  },
  paymentMethod: {
    type: "faceted",
    optionList: paymentMethods,
    size: 220,
    hidden: true,
    field: "paymentMethod",
  },
  sender: {
    type: "simpleText",
    enableHiding: false,
    order: 3,
    field: "sender",
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
  movementDirection: {
    type: "simpleText",
    hidden: true,
    field: "movementDirection",
    meta: { hidden: true },
  },
}
