import Cookies from "js-cookie"
import English from "./messages/en.json"
import Spanish from "./messages/es.json"
import { Languages } from "./types"

const LOCALE_STORAGE_VAR = "userLang"

export const LANG_DEFAULT = "es"

export const supportedLanguages: Languages[] = ["es", "en"]

export const getLocaleFromBrowser = () => {
  if (typeof navigator != "undefined" && navigator.language) {
    if (navigator.language.includes("en")) {
      return "en"
    }
    if (navigator.language.includes("es")) {
      return "es"
    }
  }
  return LANG_DEFAULT
}

export const getLocaleStored = () =>
  Cookies.get(LOCALE_STORAGE_VAR) ?? getLocaleFromBrowser()

export const setLocaleStored = (locale: string) => {
  Cookies.set(LOCALE_STORAGE_VAR, locale, {
    expires: 7,
    path: "/",
    sameSite: "strict",
  })
}

export const getLocaleI18nResource = (locale: string): Record<string, string> =>
  locale === "en" ? English : Spanish
