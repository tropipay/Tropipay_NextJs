type Charge = {
  id: string
  status: string
  email: string
  cardLast4: number
  cardBIN: number
  cardHolderName: string
  issuerBank: string
  cardType: string
  createdAt: string
  errorCode: string
  cardPan: string
  clientName: string
  clientLastName: string
  cardBrand: string
  state: string
  cardExpirationDate: string
  cardCountry: string
  clientIp: string
  clientEmail: string
  clientAddress: string
  source: string
}

type Amount = {
  value: number
  currency: string
}

type Movement = {
  id: string
  status: string
  creationDate: string
  valueDate: string
  description: string
  amount: Amount
  destinationAmount: Amount
  commission: Amount
  exchangeRate: number
  movementType: string
  paymentMethod: string
  reference: string
  product: string
  sender: string
  recipient: string
  charges: Charge[]
}
