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

function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

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
    if (!token) {
      setIsOpen(true)
    }
  }, [])

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col w-4/5 md:w-1/3 gap-y-4">
          <div>
            <p>For developers purposes:</p>
            <p className="text-black/70">
              Please set the session cookie obtained by a session on the
              Tropipay site and click the Login button.
            </p>
          </div>
          <div>
            <Button onClick={onLogin}>
              {loading && <Loader2 className="animate-spin" />}
              LOGIN
            </Button>
          </div>
        </div>
      </div>

      <Dialog {...{ open: isOpen }}>
        <DialogContent>
          <DialogHeader className="text-start">
            <DialogTitle>Authentication error</DialogTitle>
            <DialogDescription>
              Invalid session token or token is expired.
              <br />
              Please make sure that you have logged into Tropipay site and your
              session is valid.
            </DialogDescription>
          </DialogHeader>
          <DialogClose onClick={onBack}>BACK</DialogClose>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LoginPage
