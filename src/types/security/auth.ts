// lib/auth-error.ts
import { CredentialsSignin } from "next-auth"

export class SystemCredentialsSignin extends CredentialsSignin {
  constructor(message: string) {
    super(message)
    this.name = "CredentialsSignin"
    this.message = message.split("Read more")[0].trim()
  }
}
