import CookiesManager from "@/utils/cookies/cookiesManager"
import English from "./messages/en.json"
import Spanish from "./messages/es.json"
import Portuguese from "./messages/pt.json"

const LOCALE_STORAGE_VAR = "userLang"

export const LANG_DEFAULT = "es"

export const supportedLanguages: string[] = ["es", "en", "pt"]

export const getLocaleStored = () => {
  const cookieLang = CookiesManager.getInstance().get(
    LOCALE_STORAGE_VAR,
    LANG_DEFAULT
  )
  return cookieLang && supportedLanguages.includes(cookieLang)
    ? cookieLang
    : LANG_DEFAULT
}

export const setLocaleStored = (locale: string) =>
  CookiesManager.getInstance().set(LOCALE_STORAGE_VAR, locale)

export const getLocaleI18nResource = (
  locale: string
): Record<string, string> => {
  switch (locale) {
    case "es":
      return Spanish
    case "pt":
      return Portuguese
    default:
      return English
  }
}
