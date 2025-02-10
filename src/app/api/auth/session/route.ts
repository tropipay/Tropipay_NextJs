import { auth } from "@/auth"

export const GET = async () => {
  const session = await auth()
  return Response.json(session)
}
