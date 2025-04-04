"use client"

import { login } from "@/app/actions/sessionActions"
import ErrorHandler from "@/components/errorHandler"
import { useTranslation } from "@/components/intl/useTranslation"
import CookiesManager from "@/lib/cookiesManager"
import { getTokenFromSession } from "@/lib/utilsUser"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<
    Array<string | Error | { message: string }>
  >([])

  const router = useRouter()
  const { t } = useTranslation()

  const getToken = (): string =>
    getTokenFromSession(
      CookiesManager.getInstance().get("session", "fill_with_session_info")
    )

  const onLogin = async () => {
    const token = getToken()
    if (!token) {
      setErrors([t("error_login_dialog_title")])
      return
    }

    setLoading(true)
    try {
      await login(token)
      router.push("/dashboard/movements")
    } catch (e) {
      setErrors([t("error_login_dialog_title")])
    }
    setLoading(false)
  }

  const onOk = () => 
    window.location.assign(`${process.env.NEXT_PUBLIC_TROPIPAY_HOME}/login`)
  

  useEffect(() => {
    onLogin()
  }, [])

  return (
    <>
      <div className="flex items-center justify-center gap-2 h-screen">
        {loading && (
          <Loader2 className="animate-spin text-[#041266]" size={72} />
        )}
      </div>

      <ErrorHandler {...{ errors, onOk }} />
    </>
  )
}
