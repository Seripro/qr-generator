import { describe, expect, it } from "vitest";
import { add, multiply } from "./gf256.js";

describe("GF(256)", () => {
  describe("addition", () => {
    it("加算はXORである", () => {
      expect(add(0x53, 0xca)).toBe(0x99);
    });

    it("同じ値を足すと0になる", () => {
      expect(add(0x53, 0x53)).toBe(0);
    });
  });

  describe("multiplication", () => {
    it("0を掛けると0になる", () => {
      expect(multiply(0, 100)).toBe(0);
      expect(multiply(100, 0)).toBe(0);
    });

    it("1を掛けると元の値になる", () => {
      expect(multiply(1, 100)).toBe(100);
      expect(multiply(100, 1)).toBe(100);
    });
  });
});
