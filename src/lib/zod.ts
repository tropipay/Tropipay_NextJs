import { object, string } from "zod"

export const authSchema = object({
  token: string({ required_error: "Token is required" }),
})
