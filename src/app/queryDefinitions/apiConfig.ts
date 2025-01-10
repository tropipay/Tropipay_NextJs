import { movementColumns } from "./movements/movementColumns"

export const apiConfig = {
  movements: {
    url: "http://localhost:3002/api/v3/movements/business",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNmY2U5NDAwLWZhMDMtMTFlYi05MGFhLWIzMWUyZDc2NmNjMyIsImVtYWlsIjoidXNlcjEyMDMxQGVtYWlsLmNvbSIsInN0YXRlIjoxLCJreWNMZXZlbCI6NCwiaWF0IjoxNzM2NDczNzE5LCJleHAiOjE3MzY0NzczMTl9.82BaV57IDcFU1qC8VOyt2CbeQ1Pb1w4m0JqKtKfrsmM`,
    },
    body: {
      query: `query GetMovements($filter: MovementFilter, $pagination: PaginationInput) {
        movements(filter: $filter, pagination: $pagination) {
          id
          status
          creationDate
          valueDate
          description
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
          reference
          product
          sender
          recipient
          charges {
            id
            status
            email
            cardLast4
            cardBIN
            cardHolderName
            issuerBank
            cardType
            createdAt
            errorCode
            cardPan
            clientName
            clientLastName
            cardBrand
            state
            cardExpirationDate
            cardCountry
            clientIp
            clientEmail
            clientAddress
            source
          }
        }
      }`,
      operationName: "GetMovements",
      variables: {
        filter: {
          amountGte: 1000,
          currency: "EUR",
          creationDateFrom: "2024-12-01T00:00:00Z",
          creationDateTo: "2024-12-31T23:59:59Z",
        },
        pagination: {
          limit: 10,
          offset: 0,
        },
      },
    },
    columns: movementColumns,
    key: "generalMovements",
  },
}
