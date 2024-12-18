"use client"

import { login } from "@/app/actions/sessionActions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getTokenFromSession } from "@/lib/utilsUser"
import Cookies from "js-cookie"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useIntl } from "react-intl"

function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { formatMessage } = useIntl()

  const getToken = (): string => getTokenFromSession(Cookies.get("session"))

  const onLogin = async () => {
    const token = getToken()
    if (!token) {
      setIsOpen(true)
      return
    }

    setLoading(true)
    try {
      await login(token)
      router.push("/dashboard")
    } catch (e) {
      setIsOpen(true)
    }
    setLoading(false)
  }

  const onBack = () => {
    // Implement back to Tropipay page ...
    setIsOpen(false)
  }

  useEffect(() => {
    const token = getToken()
    !token && setIsOpen(true)
  }, [])

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col w-4/5 md:w-1/3 gap-y-4">
          <div>
            <p>{formatMessage({ id: "login_title" })}</p>
            <p className="text-black/70">
              {formatMessage({ id: "login_description" })}
            </p>
          </div>
          <div>
            <Button onClick={onLogin}>
              {loading && <Loader2 className="animate-spin" />}
              {formatMessage({ id: "login" })}
            </Button>
          </div>
        </div>
      </div>

      <Dialog {...{ open: isOpen }}>
        <DialogContent>
          <DialogHeader className="text-start">
            <DialogTitle>
              {formatMessage({ id: "authentication_error" })}
            </DialogTitle>
            <DialogDescription>
              {formatMessage({ id: "error_login_dialog_title" })}
              <br />
              {formatMessage({ id: "error_login_dialog_description" })}
            </DialogDescription>
          </DialogHeader>
          <DialogClose onClick={onBack}>
            {formatMessage({ id: "back" })}
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LoginPage
