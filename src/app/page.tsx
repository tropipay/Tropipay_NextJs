"use client"
import { Button } from "@/app/components/ui/button"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  return (
    <div className="container">
      <Button onClick={() => router.push("/login")}>goto login</Button>
    </div>
  )
}
