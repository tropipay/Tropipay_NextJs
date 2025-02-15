import CookiesManager from "@/lib/cookiesManager"
import English from "./messages/en.json"
import Spanish from "./messages/es.json"
import Portuguese from "./messages/pt.json"

const LOCALE_STORAGE_VAR = "userLang"

export const LANG_DEFAULT = "en"

export const supportedLanguages: string[] = ["es", "en", "pt"]

export const getLocaleStored = () => {
  /* const cookieLang = Cookies.get(LOCALE_STORAGE_VAR)
  return cookieLang && supportedLanguages.includes(cookieLang)
    ? cookieLang
    : LANG_DEFAULT */
  return "es"
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
