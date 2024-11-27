declare global {
  type ChildrenProps = Readonly<{
    children: React.ReactNode
  }>

  type User = {
    id: string
    userName: string
    phone: string
    email: string
    location: string
    role: "client" | "provider"
    status: "active" | "inactive"
    image: string
    rtn?: string
    otherInformation?: string
    createdAt?: date
    updatedAt?: date
  }

  type Movement = {
    amount: string
    state: "Pendiente" | "Procesando" | "Completado" | "Reembolsado"
    date: string
    type: string
    method: string
    user: string
    bankOrderCode: string
    concept: string
  }
}

export {}
