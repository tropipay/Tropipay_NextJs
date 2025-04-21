import { act, renderHook } from "@testing-library/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import useFilterParams from "../../src/hooks/useFilterParams"
import useFiltersManager from "../../src/hooks/useFiltersManager"

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}))

// Mock the useFilterParams hook
jest.mock("../../src/hooks/useFilterParams", () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe("useFiltersManager", () => {
  const mockedRouter = {
    replace: jest.fn(),
  }

  beforeEach(() => {
    ;(useRouter as jest.Mock).mockReturnValue(mockedRouter)
    ;(usePathname as jest.Mock).mockReturnValue("/test")
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
    ;(useFilterParams as jest.Mock).mockReturnValue({
      setParams: jest.fn(),
      getParam: jest.fn(() => []),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should initialize with the correct initial values", () => {
    const { result } = renderHook(() =>
      useFiltersManager({ column: { id: "test" } })
    )

    expect(result.current.initialSelected).toEqual([])
    expect(result.current.values).toEqual([])
  })

  it("should update values correctly", () => {
    const { result } = renderHook(() =>
      useFiltersManager({ column: { id: "test" } })
    )

    act(() => {
      result.current.setValues(["value1", "value2"])
    })

    expect(result.current.values).toEqual(["value1", "value2"])
  })
})
