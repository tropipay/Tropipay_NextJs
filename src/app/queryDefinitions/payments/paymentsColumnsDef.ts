import { movementsPaymentMethods } from "@/app/filterDefinitions/movements"
import {
  paymentStates,
  paymentStatesGroups,
  paymentTypes,
} from "@/app/filterDefinitions/payments"

export const paymentsColumnsDef: any = {
  amount: {
    type: "amount",
    showFilter: true,
    order: 0,
    field: `amount {
      value
      currency
      }`,
  },
  state: {
    type: "facetedBadge",
    optionList: paymentStates,
    optionListGroups: paymentStatesGroups,
    showFilter: true,
    field: "state",
    order: 1,
  },
  createdAt: {
    type: "date",
    showFilter: true,
    size: 120,
    field: "createdAt",
    order: 2,
  },
  paymentMethod: {
    type: "faceted",
    optionList: movementsPaymentMethods,
    size: 220,
    field: "paymentMethod",
    order: 3,
  },
  paymentType: {
    type: "faceted",
    title: "type",
    hidden: true,
    optionList: paymentTypes,
    enableSorting: false,
    size: 200,
    field: "paymentType",
  },
  reference: {
    type: "simpleText",
    field: "reference",
    order: 4,
  },
  email: {
    type: "simpleText",
    hidden: true,
    field: `email`,
  },
  cardBin: {
    type: "simpleText",
    field: "cardNumber",
    hidden: true,
    render: (value: string) => `${value} **** `,
  },
  cardPan: {
    type: "simpleText",
    field: "cardPan",
    hidden: true,
    render: (value: string) => `**** ${value}`,
  },
  cardType: {
    type: "simpleText",
    field: "cardType",
    hidden: true,
  },
  cardHolderName: {
    type: "simpleText",
    field: "cardHolderName",
    hidden: true,
  },
  cardIssuerBank: {
    type: "simpleText",
    field: "cardIssuerBank",
    hidden: true,
  },
  errorCode: {
    type: "simpleText",
    field: "errorCode",
    order: 5,
  },
  product: {
    type: "simpleText",
    field: `product`,
    order: 6,
  },
  completedAt: {
    type: "date",
    showFilter: true,
    size: 120,
    field: "completedAt",
    hidden: true,
  },
  search: {
    type: "simpleText",
    hidden: true,
    field: "search",
    meta: { hidden: true },
  },
}
