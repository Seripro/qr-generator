import { describe, expect, it } from "vitest";
import { QrMatrix } from "./matrix.js";
import { placeData } from "./dataPlacement.js";

describe("Data Placement", () => {
  it("208bitすべてをMatrixに配置できる", () => {
    const matrix = new QrMatrix(21);

    matrix.placeFinderPattern(0, 0);
    matrix.placeFinderPattern(0, 14);
    matrix.placeFinderPattern(14, 0);

    matrix.placeSeparator(0, 0);
    matrix.placeSeparator(0, 14);
    matrix.placeSeparator(14, 0);

    matrix.placeTimingPatterns();
    matrix.placeDarkModule();
    matrix.reserveFormatInformation();

    const codewords = new Uint8Array(26).fill(0);

    placeData(matrix, codewords);

    let dataCount = 0;

    for (let row = 0; row < 21; row++) {
      for (let column = 0; column < 21; column++) {
        if (matrix.isDataModule(row, column)) {
          dataCount++;
        }
      }
    }

    expect(dataCount).toBe(208);
  });

  it("codewordのbitをMSBから順番に配置する", () => {
    const matrix = new QrMatrix(21);

    matrix.placeFinderPattern(0, 0);
    matrix.placeFinderPattern(0, 14);
    matrix.placeFinderPattern(14, 0);

    matrix.placeSeparator(0, 0);
    matrix.placeSeparator(0, 14);
    matrix.placeSeparator(14, 0);

    matrix.placeTimingPatterns();
    matrix.placeDarkModule();
    matrix.reserveFormatInformation();

    const coordinates = matrix.getDataCoordinates();

    expect(coordinates.length).toBe(208);

    const codewords = new Uint8Array(26);
    codewords[0] = 0b10000000;

    placeData(matrix, codewords);

    const [firstRow, firstColumn] = coordinates[0];
    const [secondRow, secondColumn] = coordinates[1];

    expect(matrix.get(firstRow, firstColumn)).toBe(true);
    expect(matrix.get(secondRow, secondColumn)).toBe(false);
  });
});
