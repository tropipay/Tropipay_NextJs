type UserBusinessAccount = {
  id: number
  accountNumber: string
  userId: string
  alias: string
  balance: number
  pendingIn: number
  pendingOut: number
  state: number
  paymentEntityId: number
  currency: string
  type: number
  createdAt: string
  updatedAt: string
  isDefault: boolean
  TropiCards: any[]
}
