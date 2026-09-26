import { describe, expect, it } from "vitest";
import { calculateFormatInfo, placeFormatInfo } from "./formatInfo.js";
import { QrMatrix } from "./matrix.js";

describe("Format Information", () => {
  it("Format Informationを計算できる", () => {
    expect(calculateFormatInfo("L", 0)).toBe(0x77c4);
  });

  it("Format InformationをMatrixに配置できる", () => {
    const matrix = new QrMatrix(21);

    matrix.reserveFormatInformation();

    placeFormatInfo(matrix, "L", 0);

    const formatInfo = calculateFormatInfo("L", 0);

    expect(matrix.get(8, 0)).toBe(((formatInfo >> 14) & 1) === 1);

    expect(matrix.get(8, 1)).toBe(((formatInfo >> 13) & 1) === 1);

    expect(matrix.get(8, 2)).toBe(((formatInfo >> 12) & 1) === 1);
  });

  it("15bitすべてが正しい位置に配置される", () => {
    const matrix = new QrMatrix(21);

    matrix.reserveFormatInformation();

    placeFormatInfo(matrix, "L", 0);

    const formatInfo = calculateFormatInfo("L", 0);

    const positions = [
      [8, 0],
      [8, 1],
      [8, 2],
      [8, 3],
      [8, 4],
      [8, 5],
      [8, 7],
      [8, 8],
      [7, 8],
      [5, 8],
      [4, 8],
      [3, 8],
      [2, 8],
      [1, 8],
      [0, 8],
    ] as const;

    positions.forEach(([row, column], index) => {
      const expected = ((formatInfo >> (14 - index)) & 1) === 1;

      expect(matrix.get(row, column)).toBe(expected);
    });
  });
});
