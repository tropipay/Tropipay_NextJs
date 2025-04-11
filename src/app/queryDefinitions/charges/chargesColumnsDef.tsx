import {
  chargeProductTypes,
  chargeStates,
  chargeStatesGroups,
} from "@/app/filterDefinitions/charges"
import { currencyTypes } from "@/app/filterDefinitions/commons"
import { movementsPaymentMethods } from "@/app/filterDefinitions/movements"

export const chargesColumnsDef: any = {
  createdAt: {
    type: "date",
    showFilter: true,
    size: 120,
    order: 0,
  },
  amount: {
    type: "amount",
    showFilter: true,
    order: 1,
    field: `amount { value currency }`,
  },
  paymentMethod: {
    type: "faceted",
    optionList: movementsPaymentMethods,
    size: 220,
    order: 2,
  },
  state: {
    type: "facetedBadge",
    optionList: chargeStates,
    optionListGroups: chargeStatesGroups,
    showFilter: true,
    order: 3,
  },
  reference: {
    order: 4,
    showFilter: true,
  },
  email: {
    order: 5,
    showFilter: true,
  },
  concept: {
    hidden: true,
  },
  bankOrderCode: {
    hidden: true,
  },
  summary: {
    hidden: true,
  },
  clientIp: {
    hidden: true,
  },
  cardExpirationDate: {
    hidden: true,
  },
  cardBin: {
    hidden: true,
    render: (value: string) => `${value} **** `,
  },
  cardPan: {
    hidden: true,
    render: (value: string) => `**** ${value}`,
  },
  cardType: {
    hidden: true,
    filterPlaceholder: "cardType_placeholder",
  },
  fullName: {
    hidden: true,
    render: (value: string) => <span className="capitalize">{value}</span>,
  },
  issuerBank: {
    hidden: true,
  },
  errorCode: {
    hidden: true,
    order: 5,
  },
  product: {
    type: "faceted",
    optionList: chargeProductTypes,
    hidden: true,
    order: 6,
  },
  country: {
    hidden: true,
  },
  address: {
    hidden: true,
  },
  currency: {
    type: "faceted",
    hideColumn: true,
    hidden: true,
    optionList: currencyTypes,
  },
  completedAt: {
    type: "date",
    size: 120,
    hidden: true,
  },
  search: {
    hidden: true,
    meta: { hidden: true },
  },
}
