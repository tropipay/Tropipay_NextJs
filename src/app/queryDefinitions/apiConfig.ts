import { setFilters } from "@/lib/utils"
import { chargesColumns } from "./charges/chargesColumns"
import { chargesColumnsDef } from "./charges/chargesColumnsDef"
import { movementsColumns } from "./movements/movementsColumns"
import { movementsColumnsDef } from "./movements/movementsColumnsDef"
import { movementsDetailColumns } from "./movementsDetail/movementsDetailColumns"
import { movementsDetailColumnsDef } from "./movementsDetail/movementsDetailColumnsDef"

export const apiConfig: Record<string, FetchDataConfig> = {
  accounts: {
    key: "",
    url: "/api/v3/accounts",
    method: "GET",
  },
  movements: {
    key: "movements",
    url: `/api/v3/movements/business`,
    method: "POST",
    body: {
      query: `query GetMovements($filter: MovementFilter, $pagination: PaginationInput) {
        movements(filter: $filter, pagination: $pagination) {
          items {
          id
          $FIELDS }
            totalCount
          }
        }`,
      operationName: "GetMovements",
      variables: {
        filter: {},
        pagination: {
          limit: 50,
          offset: 0,
        },
      },
    },
    columns: movementsColumns,
    columnsDef: JSON.parse(JSON.stringify(movementsColumnsDef)),
    filters: setFilters(movementsColumnsDef),
    staleTime: 5 * 60 * 1000,
  },
  movementsDetail: {
    key: "movementsDetail",
    url: `/api/v3/movements/business`,
    method: "POST",
    body: {
      query: `query GetMovements($filter: MovementFilter, $pagination: PaginationInput) {
        movements(filter: $filter, pagination: $pagination) {
          items {
            id
            state
            bankOrderCode
            fee {
              value
              currency
            }
            email
            movementDetail {
              amount{
                currency
                value
              }
              cardCountry
              cardExpirationDate
              cardPan
              cardType
              chargedAmount{
                currency
                value
              }
              clientAddress
              clientIp
              completedAt
              concept
              conversionRate
              createdAt
              netAmount {
                value
                currency
              }
              recipientData{
                alias
                name
                account
              }
              senderData {
                name
                lastName
                email
              }
              type
            }
            sender
            product
          }
          totalCount
        }
      }`,
      operationName: "GetMovements",
      variables: {
        filter: {},
        pagination: {
          limit: 50,
          offset: 0,
        },
      },
    },
    columns: movementsDetailColumns,
    columnsDef: JSON.parse(JSON.stringify(movementsDetailColumnsDef)),
    filters: setFilters(movementsDetailColumnsDef),
    staleTime: 5 * 60 * 1000,
  },
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
    columns: chargesColumns,
    columnsDef: JSON.parse(JSON.stringify(chargesColumnsDef)),
    filters: setFilters(chargesColumnsDef),
    staleTime: 5 * 60 * 1000,
  },
}
