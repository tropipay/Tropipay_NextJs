import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { fetchHeaders } from "./lib/utils"

export default {
  providers: [
    Credentials({
      async authorize({ token }) {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API_URL}/api/users/profile`,
            {
              method: "GET",
              headers: {
                ...fetchHeaders,
                Authorization: `Bearer ${token}`,
              },
            }
          )

          if (!res.ok) {
            throw new Error(
              `Failed to fetch user profile: ${res.status} ${res.statusText}`
            )
          }

          const userData = await res.json()

          // Retornamos el usuario con el token incluido
          return {
            ...userData,
            access_token: token, // Guardamos el token original
          }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Authorization failed: ${error.message}`)
          } else {
            throw new Error("Authorization failed: Unknown error occurred")
          }
        }
      },
    }),
  ],

  callbacks: {
    async authorized({ auth }) {
      return !!auth
    },

    async jwt({ token, user }) {
      // Si tenemos un usuario (primera vez que se inicia sesión)
      if (user) {
        token.access_token = (user as UserSession).access_token
        delete (user as UserSession).access_token // Limpiamos el token del objeto usuario
      }
      return token
    },

    async session({ session, token }) {
      // Aseguramos que el token esté disponible en la sesión
      if (token) {
        session.user = {
          ...session.user,
          ...token,
          access_token: token.access_token,
        }
      }
      return session
    },
  },
} satisfies NextAuthConfig
