"use client"
import { useEffect, useState } from "react"
// import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { autoLogin } from "@/app/actions/sessionActions"
import { Button } from "@/components/ui/button"

function LoginPage() {
  const [tokenSession, setTokenSession] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const sessionCookie = Cookies.get("session")

    const sessionData = sessionCookie
      ? JSON.parse(decodeURIComponent(sessionCookie || "")).sessionData
      : {}
    setTokenSession(sessionData?.token)

    console.log("autoLogin con :", sessionCookie)
    // autoLogin(tokenSession)
  }, [router])

  return (
    <div>
      Formulario de Login aquí{" "}
      {tokenSession && (
        <Button onClick={() => autoLogin(tokenSession)}>LOGIN</Button>
      )}
    </div>
  )
}

export default LoginPage
