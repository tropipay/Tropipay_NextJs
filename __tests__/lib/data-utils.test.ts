import { getBaseDomain } from "../../src/utils/data/utils"

describe("getBaseDomain", () => {
  it("should return the base domain for a standard hostname", () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'www.example.com'
      }
    });
    expect(getBaseDomain()).toBe("example.com");
  });

  it("should return the base domain for a hostname with multiple subdomains", () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'sub.domain.example.com'
      }
    });
    expect(getBaseDomain()).toBe("example.com");
  });

  it("should return the base domain for a simple hostname", () => {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        hostname: 'example.com'
      }
    });
    expect(getBaseDomain()).toBe("example.com");
  });
});
