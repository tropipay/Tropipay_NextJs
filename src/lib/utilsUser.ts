import { auth } from "@/auth"

export const getUser = async () => {
  const session = await auth()
  return await JSON.stringify(session)
}
