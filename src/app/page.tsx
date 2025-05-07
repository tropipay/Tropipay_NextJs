"use client"

import { login } from "@/app/actions/sessionActions"
import ErrorHandler from "@/components/ErrorHandler"
import { useTranslation } from "@/components/intl/useTranslation"
import { Process } from "@/utils/config"
import CookiesManager from "@/utils/cookies/cookiesManager"
import { getTokenFromSession } from "@/utils/user/utilsUser"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<
    Array<string | Error | { message: string }>
  >([])

  const router = useRouter()
  const { t } = useTranslation()

  console.log("Process", Process)

  const getToken = (): string =>
    getTokenFromSession(
      CookiesManager.getInstance().get(
        "session",
        "fill_with_session_info",
        typeof window !== "undefined" &&
          window.location.hostname === "localhost" &&
          window.location.port === "3000"
      )
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
      router.push(searchParams.get("redirect") ?? "/dashboard/movements")
    } catch (e) {
      setErrors([t("error_login_dialog_title")])
    }
    setLoading(false)
  }

  const onOk = () =>
    window.location.assign(
      `${Process.env.NEXT_PUBLIC_TROPIPAY_HOME}/login?redirect=${Process.env.NEXT_PUBLIC_SITE_URL}`
    )

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
