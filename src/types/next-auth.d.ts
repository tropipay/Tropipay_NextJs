import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: UserSession
  }
}
