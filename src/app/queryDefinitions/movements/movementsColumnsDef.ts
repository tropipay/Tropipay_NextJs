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
  createdAt: {
    type: "date",
    showFilter: true,
    enableHiding: false,
    size: 120,
    field: "createdAt",
    order: 0,
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
  amount: {
    type: "amount",
    enableHiding: false,
    showFilter: true,
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
  },
  movementDirection: {
    type: "simpleText",
    hidden: true,
    field: "movementDirection",
    meta: { hidden: true },
  },
}
