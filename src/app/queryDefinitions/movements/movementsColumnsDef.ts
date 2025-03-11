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
  },
  concept: {
    type: "simpleText",
    hidden: true,
    field: `concept`,
  },
  state: {
    type: "facetedBadge",
    optionList: movementsState,
    optionListGroups: movementsStateGroups,
    enableHiding: false,
    showFilter: true,
    field: "state",
  },
  email: {
    type: "simpleText",
    hidden: true,
    field: `email`,
  },
  createdAt: {
    type: "date",
    showFilter: true,
    size: 120,
    field: "createdAt",
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
    showFilter: true,
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
