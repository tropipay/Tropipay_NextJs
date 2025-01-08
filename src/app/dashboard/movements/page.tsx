import { movementColumns } from "@/app/queryDefinitions/movements/movementColumns"
import PageClient from "./pageClient"

const MOVEMENTS_API_URL = `${process.env.NEXTAUTH_URL}/api/v3/movements/business`

async function fetchMovements() {
  const response = await fetch(MOVEMENTS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNmY2U5NDAwLWZhMDMtMTFlYi05MGFhLWIzMWUyZDc2NmNjMyIsImVtYWlsIjoidXNlcjEyMDMxQGVtYWlsLmNvbSIsInN0YXRlIjoxLCJreWNMZXZlbCI6NCwiaWF0IjoxNzM2MzYwNDU1LCJleHAiOjE3MzYzNjQwNTV9.SkDLNUuLXClBqCjwKFNyH5HL1qqUsS58vnrtcUcPxcg`,
    },
    body: JSON.stringify({
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
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.statusText}`)
  }

  const result = await response.json()
  return result.data.movements
}

export default async function Home() {
  const movements = await fetchMovements()

  return <PageClient data={movements} columns={movementColumns} />
}
