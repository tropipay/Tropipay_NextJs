import {
  chargeProductTypes,
  chargeStates,
  chargeStatesGroups,
} from "@/app/filterDefinitions/charges"
import { currencyTypes } from "@/app/filterDefinitions/commons"
import { movementsPaymentMethods } from "@/app/filterDefinitions/movements"
import ImageIcon from "@/components/ui/ImageIcon"

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
    filterSearchType: "EXACT_MATCH",
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
    filterSearchType: "EXACT_MATCH",
  },
  cardPan: {
    hidden: true,
    render: (value: string) => `**** ${value}`,
    filterSearchType: "EXACT_MATCH",
  },
  cardType: {
    hidden: true,
    filterPlaceholder: "cardType_placeholder",
    render: (value: string) => {
      return (
        <div className="flex items-center">
          <ImageIcon
            {...{
              image: `/images/cardTypes/${value}.svg`,
              fallbackImage: `/images/cardTypes/CARD.svg`,
            }}
          />
          <span className="ml-1 whitespace-nowrap overflow-hidden text-ellipsis">
            {value}
          </span>
        </div>
      )
    },
  },
  fullName: {
    hidden: true,
    render: (value: string) => <span className="capitalize">{value}</span>,
    filterSearchType: "PARTIAL_MATCH",
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
    filterSearchType: "EXACT_MATCH",
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
