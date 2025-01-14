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
  movementType: string
  paymentMethod: string
  reference: string
  sender: string
}

type MovementsResponse = {
  items: Movement[]
  totalCount: number
}
