import CookiesManager from "../../src/lib/cookiesManager"
import {
  getTokenFromSession,
  getUserSettings,
  setUserSettings,
} from "../../src/lib/utilsUser"

jest.mock("next-auth/react", () => ({
  getSession: jest.fn(),
}))

jest.mock("../../src/lib/cookiesManager", () => ({
  getInstance: jest.fn().mockReturnValue({
    get: jest.fn(),
    set: jest.fn(),
  }),
}))

describe("utilsUser", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("getTokenFromSession", () => {
    it("should return the token from the session object", () => {
      const mockSession = { sessionData: { token: "test_token" } }
      const result = getTokenFromSession(mockSession)
      expect(result).toBe("test_token")
    })

    it("should return an empty string if the token is not present", () => {
      const mockSession = { sessionData: {} }
      const result = getTokenFromSession(mockSession)
      expect(result).toBe("")
    })

    it("should return an empty string if the session is undefined", () => {
      const result = getTokenFromSession(undefined)
      expect(result).toBe("")
    })
  })

  describe("getUserSettings", () => {
    it("should return the default value if the userId is not provided", () => {
      const result = getUserSettings("", { defaultValue: "default" })
      expect(result).toEqual({ defaultValue: "default" })
    })

    it("should return the default value if the cookie is not found", () => {
      ;(CookiesManager.getInstance().get as jest.Mock).mockReturnValue(
        undefined
      )
      const result = getUserSettings("123", { defaultValue: "default" })
      expect(result).toEqual({ defaultValue: "default" })
      expect(CookiesManager.getInstance().get).toHaveBeenCalledWith(
        "userSettings-123",
        { defaultValue: "default" }
      )
    })

    it("should return the user settings from the cookie", () => {
      const mockSettings = {
        tableColumnsSettings: { table1: { section1: "settings" } },
      }
      ;(CookiesManager.getInstance().get as jest.Mock).mockReturnValue(
        mockSettings
      )
      const result = getUserSettings(
        "123",
        { defaultValue: "default" },
        "table1",
        "section1"
      )
      expect(result).toBe("settings")
      expect(CookiesManager.getInstance().get).toHaveBeenCalledWith(
        "userSettings-123",
        { defaultValue: "default" }
      )
    })
  })

  describe("setUserSettings", () => {
    it("should set the user settings in the cookie", () => {
      const mockValue = { table1: { section1: "new settings" } }
      setUserSettings("123", "new settings", "table1", "section1")
      expect(CookiesManager.getInstance().set).toHaveBeenCalledWith(
        "userSettings-123",
        { tableColumnsSettings: mockValue }
      )
    })
  })
})
