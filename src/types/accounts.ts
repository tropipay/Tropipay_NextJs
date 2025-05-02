export type UserBusinessAccount = {
  id: number
  accountNumber: string
  userId: string
  groupId: number
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
  services: any[]
}

export interface UserDepositAccount {
  id: number
  accountNumber: string
  alias: string
  firstName: string
  lastName: string
  type: number
  office: string
  countryDestination: CountryDestination
}

export interface CountryDestination {
  name: string
  slug: string
}
