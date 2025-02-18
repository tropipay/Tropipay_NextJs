import Cookies from "js-cookie"

class CookiesManager {
  private static instance: CookiesManager

  static getInstance(): CookiesManager {
    if (!CookiesManager.instance) {
      CookiesManager.instance = new CookiesManager()
    }
    return CookiesManager.instance
  }

  get = (id: string, defaultValue: any = "") => {
    const cookieValue = Cookies.get(id) ?? ""
    let value
    try {
      value = JSON.parse(cookieValue)
    } catch (e) {
      value = cookieValue
    }

    if (!value) {
      this.set(id, defaultValue)
      return defaultValue
    }

    return value
  }

  set = (id: string, value: any = "") =>
    Cookies.set(id, typeof value === "string" ? value : JSON.stringify(value))
}
export default CookiesManager
