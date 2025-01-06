"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useIntl } from "react-intl"

export default function Page() {
  const router = useRouter()
  const { formatMessage } = useIntl()
  const onGotoLogin = () => router.push("/login")

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col w-4/5 md:w-1/3 gap-y-4">
        <div>
          <p> {formatMessage({ id: "welcome_title" })}</p>
          <p className="text-black/70">
            {formatMessage({ id: "welcome_description" })}
          </p>
        </div>
        <div>
          <Button onClick={onGotoLogin}>
            {formatMessage({ id: "goto_login" })}
          </Button>
        </div>
      </div>
    </div>
  )
}
