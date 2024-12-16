type User = {
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

type UserStatus = "active" | "inactive"

type UserRole = "client" | "provider"
