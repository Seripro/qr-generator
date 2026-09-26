import { describe, expect, it } from "vitest";
import { applyMask, chooseBestMask, shouldMask } from "./mask.js";
import { QrMatrix } from "./matrix.js";
import { calculateMaskPenalty } from "./maskPenalty.js";

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

describe("chooseBestMask", () => {
  it("0〜7のマスクを評価して最小のものを選ぶ", () => {
    const matrix = new QrMatrix(21);

    for (let row = 0; row < 21; row++) {
      for (let column = 0; column < 21; column++) {
        matrix.placeDataBit(row, column, (row + column) % 2 === 0);
      }
    }

    const result = chooseBestMask(matrix);

    expect(result.mask).toBeGreaterThanOrEqual(0);
    expect(result.mask).toBeLessThanOrEqual(7);

    expect(result.penalty).toBe(calculateMaskPenalty(result.matrix));
  });
});
