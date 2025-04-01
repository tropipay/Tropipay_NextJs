type Charge = {
  id: string
  createdAt: string
  completedAt: string
  amount: Amount
  paymentMethod: string
  state: string
  reference: string
  errorCode: string
  product: string
  email: string
  cardPan: string
  cardBin: string
  fullName: string
  issuerBank: string
  cardType: string
  address: string
  // country: string
  currency: string
}

type GetChargesResponse = {
  data: { charges: ApiDataResponse<Charge> }
}
