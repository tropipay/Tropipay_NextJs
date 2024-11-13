"use client"
import { useEffect } from "react"
// import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { autoLogin } from "@/actions/sessionActions"

function LoginPage() {
  // const [isLoginFormVisible, setIsLoginFormVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const sessionCookie = Cookies.get("session")

    const sessionData = sessionCookie
      ? JSON.parse(decodeURIComponent(sessionCookie || "")).sessionData
      : {}
    const tokenSession = sessionData?.token

    console.log("autoLogin con :", sessionCookie)
    autoLogin(tokenSession)
  }, [router])

  return <div>Formulario de Login aquí</div>
}

export default LoginPage
