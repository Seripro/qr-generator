import { describe, expect, it } from "vitest";
import { QrMatrix } from "./matrix.js";

describe("QrMatrix", () => {
  it("21×21のマトリクスを作成できる", () => {
    const matrix = new QrMatrix(21);

    expect(matrix.size).toBe(21);
    expect(matrix.modules.length).toBe(21);
    expect(matrix.modules[0].length).toBe(21);
  });

  it("初期状態ではすべて未配置である", () => {
    const matrix = new QrMatrix(21);

    expect(matrix.get(0, 0)).toBeNull();
    expect(matrix.get(10, 10)).toBeNull();
    expect(matrix.get(20, 20)).toBeNull();
  });

  it("マスを設定できる", () => {
    const matrix = new QrMatrix(21);

    matrix.set(5, 10, true);

    expect(matrix.get(5, 10)).toBe(true);
  });

  it("Finder Patternを配置できる", () => {
    const matrix = new QrMatrix(21);

    matrix.placeFinderPattern(0, 0);

    expect(matrix.get(0, 0)).toBe(true);
    expect(matrix.get(0, 1)).toBe(true);
    expect(matrix.get(1, 1)).toBe(false);
    expect(matrix.get(2, 2)).toBe(true);
    expect(matrix.get(6, 6)).toBe(true);
  });

  it("3つのFinder Patternを配置できる", () => {
    const matrix = new QrMatrix(21);

    matrix.placeFinderPattern(0, 0);
    matrix.placeFinderPattern(0, 14);
    matrix.placeFinderPattern(14, 0);

    expect(matrix.get(0, 0)).toBe(true);
    expect(matrix.get(0, 20)).toBe(true);
    expect(matrix.get(20, 0)).toBe(true);
  });
});
