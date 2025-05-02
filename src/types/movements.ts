import { UserDepositAccount } from "./accounts"
import { ApiDataResponse } from "./api"

export type MovementClientData = {
  name: string
  lastName: string
  account: string
  country: string
  alias?: string
  email?: string
}

export type Movement = {
  id: string
  state: string
  createdAt: string
  completedAt: string
  amount: Amount
  movementType: string
  paymentMethod: string
  reference: string
  sender: string
  product: string
  conversionRate: string
  cardPan: string
  concept: string
  bankOrderCode: string
  email: string
  fee: Amount
}

export type MovementDetails = {
  movementDetail: {
    type: string
    clientAddress: string
    netAmount: Amount
    cardType: string
    cardExpirationDate: string
    cardCountry: string
    clientIp: string
    recipientData: MovementClientData
    senderData: MovementClientData
  }
} & Movement

export type GetMovementsResponse = {
  data: { movements: ApiDataResponse<Movement> }
}

export interface MovementScheduled {
  id: number
  credentialId: null
  userId: string
  ipUser: null
  depositaccountId: number
  originAmount: number
  currency: string
  destinationCurrency: string
  reasonId: number
  reasonDes: null
  conceptTransfer: string
  callBackUrl: null
  serviceId: null
  userReference: null
  fiat: boolean
  destinationCredentialId: null
  notifyUser: null
  initialTransactionState: null
  paymentcardId: null
  startScheduledDate: string
  frecuency: number
  state: number
  nextDate: string
  createdAt: string
  updatedAt: string
  depositaccount: UserDepositAccount
  service: any
  paymentcard: any
}

export interface GetMovementsScheduledResponse {
  count: number
  rows: MovementScheduled[]
  limit: number
  offset: string
}
