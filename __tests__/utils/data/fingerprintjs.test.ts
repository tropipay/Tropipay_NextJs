import FingerprintJS from "@fingerprintjs/fingerprintjs"
import Cookies from "js-cookie"
import {
  DEVICE_ID_COOKIE_NAME,
  getDeviceId,
} from "../../../src/utils/data/fingerprintjs"

jest.mock("@fingerprintjs/fingerprintjs")
jest.mock("js-cookie")

describe("getDeviceId", () => {
  const mockVisitorId = "mocked_device_id"

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(console, "error").mockImplementation(() => {})
  })

  it("should return deviceId from cookie if it exists", async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(mockVisitorId)
    ;(FingerprintJS.load as jest.Mock).mockResolvedValue({
      get: jest.fn().mockResolvedValue({ visitorId: "another_mocked_id" }),
    })
    const deviceId = await getDeviceId()
    expect(deviceId).toBe(mockVisitorId)
    expect(Cookies.get).toHaveBeenCalledWith(DEVICE_ID_COOKIE_NAME)
  })

  it("should generate and return a new deviceId if cookie does not exist", async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(undefined)
    const mockGet = jest.fn().mockResolvedValue({ visitorId: mockVisitorId })
    ;(FingerprintJS.load as jest.Mock).mockResolvedValue({
      get: mockGet,
    })

    const deviceId = await getDeviceId()

    expect(deviceId).toBe(mockVisitorId)
    expect(FingerprintJS.load).toHaveBeenCalled()
    expect(mockGet).toHaveBeenCalled()
  })

  it("should return null if fingerprintJsPromise fails", async () => {
    ;(Cookies.get as jest.Mock).mockReturnValue(undefined)
    ;(FingerprintJS.load as jest.Mock).mockRejectedValue(
      new Error("FingerprintJS failed")
    )

    const deviceId = await getDeviceId()

    expect(deviceId).toBeNull()
    expect(console.error).toHaveBeenCalledWith(
      "Failed to get fingerprint:",
      expect.any(Error)
    )
  })
})
