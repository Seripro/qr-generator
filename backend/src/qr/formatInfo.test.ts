import { describe, expect, it } from "vitest";
import { calculateFormatInfo, placeFormatInfo } from "./formatInfo.js";
import { QrMatrix } from "./matrix.js";

describe("Format Information", () => {
  it("Version 1-L / Mask 0 のFormat Informationを計算できる", () => {
    const result = calculateFormatInfo("L", 0);

    expect(result).toBe(0x77c4);
  });
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
