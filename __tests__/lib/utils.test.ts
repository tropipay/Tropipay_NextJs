import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  cn,
  formatAmount,
  generateHashedKey,
  getRowValue,
  isTokenExpired,
  objToHash,
  searchParamsToObject,
  selStyle,
  setFilterType,
  setFilters,
  toActiveObject,
  toArrayId,
  truncateLabels,
} from "../../src/lib/utils"

jest.mock("tailwind-merge", () => ({
  twMerge: jest.fn(),
}))

jest.mock("clsx", () => ({
  clsx: jest.fn(),
}))

describe("utils", () => {
  describe("cn", () => {
    it("should combine classes using twMerge and clsx", () => {
      ;(twMerge as jest.Mock).mockReturnValue("merged classes")
      ;(clsx as jest.Mock).mockReturnValue("clsx classes")
      const result = cn("class1", "class2")
      expect(twMerge).toHaveBeenCalledWith("clsx classes")
      expect(result).toBe("merged classes")
    })
  })

  describe("generateHashedKey", () => {
    it("should generate a hashed key from a string and an object", () => {
      const key = "test"
      const obj = { a: 1, b: 2 }
      const result = generateHashedKey(key, obj)
      expect(result).toBeDefined()
      expect(typeof result).toBe("string")
    })
  })

  describe("searchParamsToObject", () => {
    it("should convert URLSearchParams to an object", () => {
      const searchParams = new URLSearchParams("a=1&b=2&c=3")
      const result = searchParamsToObject(searchParams)
      expect(result).toEqual({ a: "1", b: "2", c: "3" })
    })
  })

  describe("selStyle", () => {
    it("should return classesTrue when condition is true", () => {
      const result = selStyle(true, "true", "false", "common")
      expect(result).toBe("true")
    })

    it("should return classesFalse when condition is false", () => {
      const result = selStyle(false, "true", "false", "common")
      expect(result).toBe("false")
    })
  })

  describe("formatAmount", () => {
    it("should format an amount with default currency and position", () => {
      const result = formatAmount(10000)
      expect(result).toBeDefined()
      expect(typeof result).toBe("string")
    })

    it("should format an amount with a specified currency and position", () => {
      const result = formatAmount(10000, "USD", "left")
      expect(result).toBeDefined()
      expect(typeof result).toBe("string")
    })
  })

  describe("truncateLabels", () => {
    it("should truncate labels when the concatenated length exceeds maxLength", () => {
      const options = ["label1", "label2", "label3"]
      const result = truncateLabels(options, 20)
      expect(result).toBe("label1, label2, l...")
    })

    it("should not truncate labels when the concatenated length is less than or equal to maxLength", () => {
      const options = ["label1", "label2"]
      const result = truncateLabels(options, 20)
      expect(result).toBe("label1, label2")
    })
  })

  describe("setFilterType", () => {
    it("should return the correct filter type based on the input type", () => {
      let result = setFilterType({}, "simpleText")
      expect(result).toBe("uniqueValue")
      result = setFilterType({}, "faceted")
      expect(result).toBe("list")
      result = setFilterType({}, "date")
      expect(result).toBe("date")
      result = setFilterType({}, "amount")
      expect(result).toBe("amount")
      result = setFilterType({}, "facetedBadge")
      expect(result).toBe("list")
      result = setFilterType({}, "free")
      expect(result).toBe("uniqueValue")
      result = setFilterType({}, "select")
      expect(result).toBe(null)
    })
  })

  describe("setFilters", () => {
    it("should return an array of ColumnDef objects", () => {
      const columnsConfig = {
        id: {
          type: "simpleText",
          title: "ID",
        },
      }
      const result = setFilters(columnsConfig)
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(1)
      expect(result[0]).toBeDefined()
    })
  })

  describe("objToHash", () => {
    it("should convert an object to a hash", () => {
      const obj = { a: true, b: false, c: true }
      const result = objToHash(obj)
      expect(result).toBeDefined()
      expect(typeof result).toBe("string")
    })
  })

  describe("toArrayId", () => {
    it("should convert an array to an array of IDs", () => {
      const arr = [
        { id: "1", name: "a" },
        { id: "2", name: "b" },
      ]
      const result = toArrayId(arr, "name", "a")
      expect(result).toEqual(["1"])
    })
  })

  describe("toActiveObject", () => {
    it("should convert an array to an active object", () => {
      const arr = [
        { id: "1", name: "a" },
        { id: "2", name: "b" },
      ]
      const result = toActiveObject(arr, "name", "a")
      expect(result).toEqual({ "1": true, "2": false })
    })
  })

  describe("getRowValue", () => {
    it("should return the value if it exists", () => {
      const result = getRowValue("test")
      expect(result).toBe("test")
    })

    it('should return "-" if the value does not exist', () => {
      const result = getRowValue("")
      expect(result).toBe("-")
    })
  })

  describe("isTokenExpired", () => {
    it("should return true if the token is expired", () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzcwMDAwMDB9.test"
      const result = isTokenExpired(token)
      expect(result).toBe(true)
    })

    it("should return true if the token is invalid", () => {
      const token = "invalid_token"
      const result = isTokenExpired(token)
      expect(result).toBe(true)
    })
  })
})
