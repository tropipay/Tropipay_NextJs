import { ApiDataResponse } from "./api"
import { UserDepositAccount } from "./security/userAccounts"

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
  email: string
  fee: Amount
  bankOrderCode: string
}

export type MovementDetails = {
  movementDetail: {
    amount: Amount
    state: string
    createdAt: string
    completedAt: string
    type: string
    clientAddress: string
    netAmount: Amount
    chargedAmount: Amount
    cardType: string
    cardExpirationDate: string
    cardCountry: string
    clientIp: string
    recipientData: MovementClientData
    senderData: MovementClientData
    refundable: boolean
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
