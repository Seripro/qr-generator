import { describe, expect, it } from "vitest";
import { applyMask, shouldMask } from "./mask.js";
import { QrMatrix } from "./matrix.js";

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

  describe("applyMask", () => {
    it("データモジュールだけをマスクする", () => {
      const matrix = new QrMatrix(5);

      matrix.placeDataBit(2, 2, true);

      applyMask(matrix, 0);

      expect(matrix.get(2, 2)).toBe(false);
    });

    it("データモジュール以外にはマスクしない", () => {
      const matrix = new QrMatrix(5);

      matrix.set(2, 2, true);

      applyMask(matrix, 0);

      expect(matrix.get(2, 2)).toBe(true);
    });

    it("マスク条件がfalseなら反転しない", () => {
      const matrix = new QrMatrix(5);

      matrix.placeDataBit(2, 3, true);

      // mask 0:
      // (2 + 3) % 2 === 1
      // → falseなので反転しない
      applyMask(matrix, 0);

      expect(matrix.get(2, 3)).toBe(true);
    });
  });
});
