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

  it("Finder Patternの外側にSeparatorを配置できる", () => {
    const matrix = new QrMatrix(21);

    matrix.placeFinderPattern(0, 0);
    matrix.placeSeparator(0, 0);

    expect(matrix.get(0, 0)).toBe(true);
    expect(matrix.get(0, 7)).toBe(false);
    expect(matrix.get(7, 0)).toBe(false);
  });

  it("Timing Patternを配置できる", () => {
    const matrix = new QrMatrix(21);

    matrix.placeFinderPattern(0, 0);
    matrix.placeFinderPattern(0, 14);
    matrix.placeFinderPattern(14, 0);

    matrix.placeSeparator(0, 0);
    matrix.placeSeparator(0, 14);
    matrix.placeSeparator(14, 0);

    matrix.placeTimingPatterns();

    expect(matrix.get(6, 8)).toBe(true);
    expect(matrix.get(6, 9)).toBe(false);
    expect(matrix.get(6, 10)).toBe(true);

    expect(matrix.get(8, 6)).toBe(true);
    expect(matrix.get(9, 6)).toBe(false);
    expect(matrix.get(10, 6)).toBe(true);
  });

  it("Dark Moduleを配置できる", () => {
    const matrix = new QrMatrix(21);

    matrix.placeDarkModule();

    expect(matrix.get(13, 8)).toBe(true);
  });

  it("Format Informationの領域を予約できる", () => {
    const matrix = new QrMatrix(21);

    matrix.reserveFormatInformation();

    expect(matrix.isReserved(0, 8)).toBe(true);
    expect(matrix.isReserved(5, 8)).toBe(true);
    expect(matrix.isReserved(7, 8)).toBe(true);
    expect(matrix.isReserved(8, 8)).toBe(true);
    expect(matrix.isReserved(8, 7)).toBe(true);
    expect(matrix.isReserved(8, 0)).toBe(true);
    expect(matrix.isReserved(8, 5)).toBe(true);

    expect(matrix.isReserved(8, 13)).toBe(true);
    expect(matrix.isReserved(8, 20)).toBe(true);

    expect(matrix.isReserved(14, 8)).toBe(true);
    expect(matrix.isReserved(20, 8)).toBe(true);

    // Timing Patternの位置はFormat Informationではない
    expect(matrix.isReserved(6, 8)).toBe(false);
    expect(matrix.isReserved(8, 6)).toBe(false);
    expect(matrix.isReserved(13, 8)).toBe(false);
  });
});
