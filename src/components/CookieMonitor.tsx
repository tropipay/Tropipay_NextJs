"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

type Props = {
  cookieName: string
  redirectPath: string
}

const CookieMonitor = ({ cookieName, redirectPath }: Props) => {
  const router = useRouter()

  // Función para obtener el valor de la cookie
  const getCookie = (name: string) => {
    if (typeof document === "undefined") return null // Para SSR
    const cookies = document.cookie.split("; ")
    const cookie = cookies.find((c) => c.startsWith(`${name}=`))
    return cookie ? cookie.split("=")[1] : null
  }

  useEffect(() => {
    const checkCookie = () => {
      const cookieValue = getCookie(cookieName)
      if (!cookieValue) {
        router.push(redirectPath)
      }
    }

    // Verificar cada segundo (ajusta según necesidad)
    const interval = setInterval(checkCookie, 1000)
    return () => clearInterval(interval)
  }, [cookieName, redirectPath, router])

  return null // Componente sin UI
}

export default CookieMonitor
