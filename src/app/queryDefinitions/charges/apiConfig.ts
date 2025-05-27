import { FetchDataConfig } from "@/types/fetchData"
import { setFilters } from "@/utils/data/utils"
import { chargesColumns } from "./chargesColumns"
import { chargesColumnsDef } from "./chargesColumnsDef"
import { chargesDetailColumns } from "./chargesDetail/chargesDetailColumns"
import { chargesDetailColumnsDef } from "./chargesDetail/chargesDetailColumnsDef"

export const chargesApiConfig: Record<string, FetchDataConfig> = {
  charges: {
    key: "charges",
    url: `/api/v3/movements/business/charges`,
    method: "POST",
    body: {
      query: `query GetCharges($filter: ChargeFilter, $pagination: PaginationInput) {
        charges(filter: $filter, pagination: $pagination) {
          items {
          id
          $FIELDS }
            totalCount
          }
        }`,
      operationName: "GetCharges",
      variables: {
        filter: {},
        pagination: {
          limit: 50,
          offset: 0,
        },
      },
    },
    columns: chargesColumns,
    columnsDef: JSON.parse(JSON.stringify(chargesColumnsDef)),
    filters: setFilters(chargesColumnsDef),
    staleTime: 5 * 60 * 1000,
  },
  chargesDetail: {
    key: "chargesDetail",
    url: `/api/v3/movements/business/charges`,
    method: "POST",
    body: {
      query: `query GetCharges($filter: ChargeFilter, $pagination: PaginationInput) {
        charges(filter: $filter, pagination: $pagination) {
          items {
            id
            amount {
              value
              currency
            }
            state
            createdAt
            completedAt
            fullName
            paymentMethod
            cardBin
            cardPan
            reference
            errorCode
            email
            address
            country
            cardCountry
            cardExpirationDate
            clientIp
            refundable
            movementId
          }
          totalCount
        }
      }`,
      operationName: "GetCharges",
      variables: {
        filter: {},
        pagination: {
          limit: 50,
          offset: 0,
        },
      },
    },
    columns: chargesDetailColumns,
    columnsDef: JSON.parse(JSON.stringify(chargesDetailColumnsDef)),
    filters: setFilters(chargesDetailColumnsDef),
    staleTime: 5 * 60 * 1000,
  },
}
