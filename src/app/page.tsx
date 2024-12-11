"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"

export default function Page() {
  const router = useRouter()

  // Verificar y crear la cookie si no existe
  if (!Cookies.get("session")) {
    Cookies.set("session", "default_value", {
      expires: 7, // Duración de 7 días
      path: "/", // Disponible en todas las rutas
      secure: true, // Solo en HTTPS
      sameSite: "strict", // Protección CSRF
    })
  }

  return (
    <div className="container">
      <Button onClick={() => router.push("/login")}>goto login</Button>
    </div>
  )
}
