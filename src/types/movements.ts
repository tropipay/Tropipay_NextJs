type MovementClientData = {
  name: string
  account: string
  country: string
  alias?: string
  email?: string
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
  email?: string
  fee?: Amount
}

type MovementDetail = {
  movementDetail: {
    amount: Amount
    state: string
    bankOrderCode: string
    createdAt: string
    completedAt: string
    type: string
    product: string
    concept: string
    clientAddress: string
    conversionRate: string
    netAmount: Amount
    cardType: string
    cardPan: string
    cardExpirationDate: string
    cardCountry: string
    clientIp: string
    recipientData: MovementClientData
    senderData: MovementClientData
  }
} & Movement

type GetMovementsResponse = {
  data: { movements: ApiDataResponse<Movement> }
}
