import { movementColumns } from "./movements/movementColumns"
import { FetchDataConfig } from "./types"

export const apiConfig: Record<string, FetchDataConfig> = {
  accounts: {
    key: "",
    url: "/api/v3/accounts",
    method: "GET",
  },
  movements: {
    key: "generalMovements",
    url: `/api/v3/movements/business`,
    method: "POST",
    body: {
      query: `query GetMovements($filter: MovementFilter, $pagination: PaginationInput) {
        movements(filter: $filter, pagination: $pagination) {
          items {
              id
              reference
              state
              bankOrderCode
              createdAt
              completedAt
              amount {
                value
                currency
              }
              destinationAmount {
                value
                currency
              }
              commission {
                value
                currency
              }
              exchangeRate
              movementType
              paymentMethod
              sender
              recipient
              charges {
                  state
                  orderCode
                  email
                  cardHolderName
                  issuerBank
                  cardType
                  createdAt
                  errorCode
                  cardPan
                  clientName
                  clientLastName
                  cardBrand
                  cardExpirationDate
                  cardCountry
                  clientIp
                  clientEmail
                  clientAddress
                  source
              }
            }
            totalCount
          }
        }`,
      operationName: "GetMovements",
      variables: {
        filter: {
          amountGte: 1000,
        },
        pagination: {
          limit: 50,
          offset: 0,
        },
      },
    },
    columns: movementColumns,
  },
}
