import { ApiDataResponse } from "./api"

export type Charge = {
  id: string
  createdAt: string
  completedAt: string
  amount: Amount
  paymentMethod: string
  state: string
  reference: string
  product?: string
  email: string
  fullName: string
  issuerBank?: string
  cardType: string
  cardPan: string | null
  cardBin: string | null
  errorCode: string | null
  address: string | null
  cardCountry?: string | null
  currency: string
  country?: string
  cardExpirationDate?: string
  clientIp?: string
  bankOrderCode: string
}

export type GetChargesResponse = {
  data: { charges: ApiDataResponse<Charge> }
}
