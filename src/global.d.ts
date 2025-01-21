declare global {
  type ChildrenProps = Readonly<{
    children: React.ReactNode
  }>

  type UserSession = {
    [key: string]: any
    name: string
    email: string
    logo: string
    createdAt?: Date
    updatedAt?: Date
    id?: string
    access_token?: string
  } & AdapterUser
}

export {}
