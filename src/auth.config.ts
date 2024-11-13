import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

export default {
  providers: [
    Credentials({
      credentials: {
        token: {},
      },
      authorize: async (credentials) => {
        console.log(
          "-------------------------------------credentials.token:",
          credentials
        )
        try {
          const res = await fetch("http://localhost:3000/api2/users/profile", {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${credentials.token}`,
            },
          })

          // Verifica si la respuesta es exitosa
          if (!res.ok) {
            throw new Error(
              `Failed to fetch user profile: ${res.status} ${res.statusText}`
            )
          }

          const user = await res.json()
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.logo,
            lang: user.lang,
          }
        } catch (error) {
          // Aseguramos que error sea de tipo Error
          if (error instanceof Error) {
            throw new Error(`Authorization failed: ${error.message}`)
          } else {
            throw new Error("Authorization failed: Unknown error occurred")
          }
        }
      },
    }),
  ],
} satisfies NextAuthConfig
