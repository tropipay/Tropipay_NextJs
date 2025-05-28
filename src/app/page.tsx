"use client"

import { login, logout } from "@/app/actions/sessionActions"
import ErrorHandler from "@/components/ErrorHandler"
import { useTranslation } from "@/components/intl/useTranslation"
import { env } from "@/config/env"
import { getBaseDomain } from "@/utils/data/utils"
import { getToken } from "@/utils/user/utilsUser"
import Cookies from "js-cookie"
import { Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Page() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<boolean>(false)
  const [title, setTitle] = useState<string>()
  const [errors, setErrors] = useState<
    Array<string | Error | { message: string }>
  >([])

  const router = useRouter()
  const { t } = useTranslation()

  const onLogin = async () => {
    const token = getToken()
    if (!token) {
      setTitle(t("session_no_create"))
      setErrors([t("session_no_create_description")])
      return
    }

    setLoading(true)
    const result = await login(token)
    setLoading(false)

    if (result?.error) {
      if (result?.error === "ERROR_USER_NOT_AUTHORIZED") {
        setTitle(t("session_no_authorized"))
        setErrors([t("session_no_authorized_description")])
      } else {
        setTitle(t("session_expired"))
        setErrors([t("session_expired_description")])
      }
    } else {
      const redirectTo = searchParams.get("redirect") ?? "/dashboard/movements"
      console.log(`Login successfully. Redirect to ${redirectTo} ...`)
      router.push(redirectTo)
    }
  }

  const onOk = async () => {
    await logout()
    Cookies.remove("session", { path: "/", domain: getBaseDomain() })
    window.location.assign(
      `${env.TROPIPAY_HOME}/login?redirect=${env.SITE_URL}`
    )
  }

  useEffect(() => {
    onLogin()
  }, [])

  return (
    <>
      <div className="flex items-center justify-center gap-2 h-screen">
        {loading && (
          <Loader2 className="animate-spin text-[#041266]" size={56} />
        )}
      </div>

      <ErrorHandler
        {...{
          title,
          buttonOkTitle: t("session_start"),
          errors,
          onOk,
        }}
      />
    </>
  )
}
