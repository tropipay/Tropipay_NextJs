type Amount = {
  value: number
  currency: string
}

type Movement = {
  id: string
  state: string
  createdAt: string
  completedAt: string
  amount: Amount
  movementType: string
  paymentMethod: string
  reference: string
  sender: string
}

type GetMovementsResponse = {
  data: { movements: ApiDataResponse<Movement> }
}
