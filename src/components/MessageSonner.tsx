import { useTranslations } from "@/utils/intl"
import { useEffect } from "react"
import { toast } from "sonner"

const ApiErrors = [
  { errorCode: 400, errorType: "ERRORAPI_bad_request" },
  { errorCode: 401, errorType: "ERRORAPI_unauthorized" },
  { errorCode: 403, errorType: "ERRORAPI_forbidden" },
  { errorCode: 404, errorType: "ERRORAPI_not_found" },
  { errorCode: 405, errorType: "ERRORAPI_method_not_allowed" },
  { errorCode: 409, errorType: "ERRORAPI_conflict" },
  { errorCode: 422, errorType: "ERRORAPI_unprocessable_entity" },
  { errorCode: 429, errorType: "ERRORAPI_too_many_requests" },
  { errorCode: 500, errorType: "ERRORAPI_internal_server_error" },
  { errorCode: 502, errorType: "ERRORAPI_bad_gateway" },
  { errorCode: 503, errorType: "ERRORAPI_service_unavailable" },
  { errorCode: 504, errorType: "ERRORAPI_gateway_timeout" },
]

function getApiErrorMessage(t, obj, defaultKey = "ERRORAPI_unexpected") {
  if (!obj?.data?.error) {
    return t(defaultKey)
  }

  const errorStatus = obj.data.error.status
  const matchedError = ApiErrors.find((e) => e.errorCode === errorStatus)

  const { i18n, details } = obj.data.error
  return details[0]?.i18n || i18n || t(matchedError?.errorType) || t(defaultKey)
}

const MessageSonner = ({ messageData, setMessageData }) => {
  const { t } = useTranslations()

  useEffect(() => {
    if (!messageData) return
    const isError = messageData?.data?.error

    try {
      if (isError) {
        const message = getApiErrorMessage(t, messageData)
        toast.error("error", {
          description: message,
          onAutoClose: () => setMessageData(null),
          onDismiss: () => setMessageData(null),
        })
      } else {
        toast.success(messageData?.title || t("Success"), {
          description: messageData?.message,
          onAutoClose: () => setMessageData(null),
          onDismiss: () => setMessageData(null),
        })
      }
    } catch (err) {
      toast.error(t("error"), { description: t("UNKNOWN_ERROR") })
    }
  }, [messageData, t])

  return null
}

export default MessageSonner
