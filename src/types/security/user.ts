import { SortingState } from "@tanstack/react-table"

export type User = {
  id: string
  userName: string
  phone: string
  email: string
  location: string
  role: UserRole
  status: UserStatus
  image: string
  rtn?: string
  otherInformation?: string
  createdAt?: Date
  updatedAt?: Date
}

export type UserStatus = "active" | "inactive"

export type UserRole = "client" | "provider"

export type UserTableColumnsSettings = Record<string, UserColumnsSettings>

export type UserColumnsSettings = {
  columnOrder: string[]
  columnSorting: SortingState
  columnVisibility?: Record<string, boolean>
}

export type UserSettings = {
  tableColumnsSettings: UserTableColumnsSettings
}
