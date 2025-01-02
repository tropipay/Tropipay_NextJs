import Cookies from "js-cookie"
import English from "./messages/en.json"
import Spanish from "./messages/es.json"
import Portuguese from "./messages/pt.json"
import { Languages } from "./types"

const LOCALE_STORAGE_VAR = "userLang"

export const LANG_DEFAULT = "en"

export const supportedLanguages: Languages[] = ["es", "en", "pt"]

export const getLocaleStored = () => Cookies.get(LOCALE_STORAGE_VAR)

export const setLocaleStored = (locale: string) => {
  Cookies.set(LOCALE_STORAGE_VAR, locale, {
    expires: 7,
    path: "/",
    sameSite: "strict",
  })
}

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
