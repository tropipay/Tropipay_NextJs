declare global {
  type ChildrenProps = Readonly<{
    children: React.ReactNode
  }>

  type UserSession = {
    name: string
    email: string
    logo: string
    createdAt?: Date
    updatedAt?: Date
  } & AdapterUser
}

export {}
