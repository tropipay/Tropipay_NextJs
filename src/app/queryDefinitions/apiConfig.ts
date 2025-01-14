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
        items {
            id
            status
            creationDate
            valueDate
            description
            amount {
              value
              currency
            }
            movementType
            paymentMethod
            reference
            sender
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
          limit: 10,
          offset: 0,
        },
      },
    },
    columns: movementColumns,
    key: "generalMovements",
  },
}
