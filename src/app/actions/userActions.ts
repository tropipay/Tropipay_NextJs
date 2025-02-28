"use server"

import { fetchHeaders } from "@/lib/utils"
import { UserTableColumnsSettings } from "@/types/security/user"

/**
 * Getting user table settings by user id.
 * @param userId user id
 * @returns
 */
export const getUserTableSettings = async (userId: string) => {
  const response = await fetch(`http://localhost:8000/settings/${userId}`, {
    method: "get",
    headers: fetchHeaders,
  })

  if (!response.ok) throw new Error(response.statusText)

  return await response.json()
}

/**
 * Update user table settings by user id (json-server)
 * @param userId user id
 * @param userTableSettings table settings
 * @returns
 */
export const updateUserTableSettings = async (
  userId: string,
  userTableSettings: UserTableColumnsSettings
) => {
  const response = await fetch(`http://localhost:8000/settings/${userId}`, {
    method: "put",
    headers: fetchHeaders,
    body: JSON.stringify({ tableColumnsSettings: userTableSettings }),
  })

  if (!response.ok) throw new Error(response.statusText)

  return await response.json()
}
