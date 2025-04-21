import { act, renderHook } from "@testing-library/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import useFilterParams from "../../src/hooks/useFilterParams"

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}))

describe("useFilterParams", () => {
  const mockedRouter = {
    replace: jest.fn(),
  }

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue(mockedRouter)
    ;(usePathname as jest.Mock).mockReturnValue("/test")
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should set and get parameters correctly", () => {
    const { result } = renderHook(() => useFilterParams())

    act(() => {
      result.current.setParams({ test: "value" })
    })

    expect(mockedRouter.replace).toHaveBeenCalledWith("/test?_test=value", {
      scroll: false,
    })

    ;(useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("_test=value")
    )
    const { result: result2 } = renderHook(() => useFilterParams())

    expect(result2.current.getParam("test")).toBe("value")
  })

  it("should delete parameters correctly", () => {
    const { result } = renderHook(() => useFilterParams())

    act(() => {
      result.current.setParams({ test: null })
    })

    expect(mockedRouter.replace).toHaveBeenCalledWith("/test?", {
      scroll: false,
    })
  })

  it("should handle object parameters correctly", () => {
    const { result } = renderHook(() => useFilterParams())

    act(() => {
      result.current.setParams({ test: { key: "value" } })
    })

    expect(mockedRouter.replace).toHaveBeenCalledWith(
      "/test?_test=%7B%22key%22%3A%22value%22%7D",
      { scroll: false }
    )

    ;(useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("_test=%7B%22key%22%3A%22value%22%7D")
    )
    const { result: result2 } = renderHook(() => useFilterParams())

    expect(result2.current.getParam("test")).toEqual({ key: "value" })
  })
})
