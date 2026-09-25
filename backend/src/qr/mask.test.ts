import { describe, expect, it } from "vitest";
import { shouldMask } from "./mask.js";

describe("Mask Pattern", () => {
  it("Mask 0を判定できる", () => {
    expect(shouldMask(0, 0, 0)).toBe(true);
    expect(shouldMask(0, 0, 1)).toBe(false);
    expect(shouldMask(0, 1, 0)).toBe(false);
    expect(shouldMask(0, 1, 1)).toBe(true);
  });

  it("未対応のMaskはエラーになる", () => {
    expect(() => {
      shouldMask(8, 0, 0);
    }).toThrow("Unsupported mask: 8");
  });

  it("8種類のMaskを判定できる", () => {
    for (let mask = 0; mask < 8; mask++) {
      expect(() => {
        shouldMask(mask, 10, 10);
      }).not.toThrow();
    }
  });
});
