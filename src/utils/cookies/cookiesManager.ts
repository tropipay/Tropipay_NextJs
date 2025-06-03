import Cookies from "js-cookie"

/**
 * CookiesManager class
 * Manages cookies using the js-cookie library.
 */
class CookiesManager {
  /**
   * @private
   * The singleton instance of the CookiesManager.
   */
  private static instance: CookiesManager

  /**
   * Gets the singleton instance of the CookiesManager.
   * @returns {CookiesManager} The singleton instance.
   */
  static getInstance(): CookiesManager {
    /**
     * If the instance doesn't exist, create a new one.
     */
    if (!CookiesManager.instance) {
      CookiesManager.instance = new CookiesManager()
    }
    return CookiesManager.instance
  }

  /**
   * Gets a cookie by its ID.
   * @param {string} id The ID of the cookie to get.
   * @param {any} [defaultValue=""] The default value to return if the cookie is not found.
   * @returns The value of the cookie, or the default value if not found.
   */
  get = (id: string, defaultValue: any = "", createCookie = true) => {
    /**
     * Gets the cookie value from the js-cookie library.
     */
    const cookieValue = Cookies.get(id) ?? ""
    let value
    try {
      value = JSON.parse(cookieValue)
    } catch (e) {
      value = cookieValue
    }

    if (!value) {
      if (createCookie) this.set(id, defaultValue)
      return defaultValue
    }

    return value
  }

  /**
   * Sets a cookie by its ID.
   * @param {string} id The ID of the cookie to set.
   * @param {any} [value=""] The value to set the cookie to.
   */
  set = (id: string, value: any = "") => {
    /**
     * Sets the cookie value using the js-cookie library.
     */
    Cookies.set(id, typeof value === "string" ? value : JSON.stringify(value))
  }

  /**
   * Deletes a cookie by its ID.
   * @param {string} id The ID of the cookie to delete.
   */
  delete = (id: string) => {
    Cookies.remove(id)
  }
}

export default CookiesManager
