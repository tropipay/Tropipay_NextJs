import { act, renderHook } from "@testing-library/react"
import { toast, useToast } from "../../src/hooks/useToast"

describe("useToast", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should add a toast", () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      toast({ title: "Test Toast" })
    })

    expect(result.current.toasts.length).toBe(1)
    expect(result.current.toasts[0].title).toBe("Test Toast")
  })

  it("should update a toast", () => {
    const { result } = renderHook(() => useToast())

    let id: string | undefined
    let update: any

    act(() => {
      const toastResult = toast({ title: "Test Toast" })
      id = toastResult.id
      update = toastResult.update
    })

    act(() => {
      if (id && update) {
        update({ title: "Updated Toast" })
      }
    })

    expect(result.current.toasts.length).toBe(1)
    expect(result.current.toasts[0].title).toBe("Updated Toast")
  })
})
