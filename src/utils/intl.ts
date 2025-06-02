import { useIntl } from "react-intl"

export function useTranslations() {
  const intl = useIntl()

  const t = (id: string, values?: Record<string, any>) => {
    try {
      return intl.formatMessage({ id }, values)
    } catch (error) {
      console.error(`Translation error for id "${id}":`, error)
      return id
    }
  }

  return { t }
}
