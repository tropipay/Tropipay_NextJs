import Cookies from "js-cookie"

class CookiesManager {
  private static instance: CookiesManager

  static getInstance(): CookiesManager {
    if (!CookiesManager.instance) {
      CookiesManager.instance = new CookiesManager()
    }
    return CookiesManager.instance
  }

  get = (id: string, defaultValue: string = "") => {
    const value = Cookies.get(id)
    if (!value) {
      Cookies.set(id, defaultValue)
      return defaultValue
    }

    return value
  }

  set = (id: string, value: string = "") => Cookies.set(id, value)
}
export default CookiesManager
