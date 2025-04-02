import {
  chargeProductTypes,
  chargeStates,
  chargeStatesGroups,
} from "@/app/filterDefinitions/charges"
import { movementsPaymentMethods } from "@/app/filterDefinitions/movements"

export const chargesColumnsDef: any = {
  amount: {
    type: "amount",
    showFilter: true,
    order: 0,
    field: `amount { value currency }`,
  },
  state: {
    type: "facetedBadge",
    optionList: chargeStates,
    optionListGroups: chargeStatesGroups,
    showFilter: true,
    order: 1,
  },
  createdAt: {
    type: "date",
    showFilter: true,
    size: 120,
    order: 2,
  },
  paymentMethod: {
    type: "faceted",
    optionList: movementsPaymentMethods,
    size: 220,
    order: 3,
  },
  reference: {
    order: 4,
  },
  concept: {
    showFilter: true,
    hidden: true,
  },
  bankOrderCode: {
    hidden: true,
  },
  summary: {
    hidden: true,
  },
  email: {
    hidden: true,
  },
  // cardBin: {
  //   hidden: true,
  //   render: (value: string) => `${value} **** `,
  // },
  cardPan: {
    hidden: true,
    render: (value: string) => `**** ${value}`,
  },
  cardType: {
    hidden: true,
  },
  fullName: {
    hidden: true,
  },
  issuerBank: {
    hidden: true,
  },
  errorCode: {
    order: 5,
  },
  product: {
    type: "faceted",
    optionList: chargeProductTypes,
    order: 6,
  },
  // country: {
  //   hidden: true,
  // },
  address: {
    hidden: true,
  },
  currency: {
    hidden: true,
  },
  completedAt: {
    type: "date",
    showFilter: true,
    size: 120,
    hidden: true,
  },
  search: {
    hidden: true,
    meta: { hidden: true },
  },
}
