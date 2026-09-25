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

  it("Format InformationをMatrixに配置できる", () => {
    const matrix = new QrMatrix(21);

    const formatInfo = 0x77c4;

    matrix.placeFormatInformation(formatInfo);

    expect(matrix.get(0, 8)).toBe(false);
    expect(matrix.get(1, 8)).toBe(false);
    expect(matrix.get(7, 8)).toBe(true);
    expect(matrix.get(8, 8)).toBe(true);

    expect(matrix.get(8, 20)).toBe(false);
    expect(matrix.get(8, 13)).toBe(true);

    expect(matrix.get(14, 8)).toBe(true);
    expect(matrix.get(20, 8)).toBe(true);
  });

  it("空いている場所にデータビットを配置できる", () => {
    const matrix = new QrMatrix(21);

    matrix.placeDataBit(20, 20, true);

    expect(matrix.get(20, 20)).toBe(true);
  });

  it("既に使用されている場所にはデータを配置できない", () => {
    const matrix = new QrMatrix(21);

    matrix.set(20, 20, true);

    expect(() => {
      matrix.placeDataBit(20, 20, false);
    }).toThrow("Cannot place data on an occupied module");
  });

  it("予約領域にはデータを配置できない", () => {
    const matrix = new QrMatrix(21);

    matrix.reserveFormatInformation();

    expect(() => {
      matrix.placeDataBit(0, 8, true);
    }).toThrow("Cannot place data on a reserved module");
  });

  it("データ配置用の座標をジグザグ順に取得できる", () => {
    const matrix = new QrMatrix(21);

    const coordinates = matrix.getDataCoordinates();

    expect(coordinates[0]).toEqual([20, 20]);
    expect(coordinates[1]).toEqual([20, 19]);
    expect(coordinates[2]).toEqual([19, 20]);
    expect(coordinates[3]).toEqual([19, 19]);
  });

  it("Timing Patternの列6をデータ配置から除外する", () => {
    const matrix = new QrMatrix(21);

    const coordinates = matrix.getDataCoordinates();

    expect(coordinates.some(([, column]) => column === 6)).toBe(false);
  });

  it("使用済みのマスにはデータ配置しない", () => {
    const matrix = new QrMatrix(21);

    matrix.placeFinderPattern(14, 14);

    const coordinates = matrix.getDataCoordinates();

    expect(
      coordinates.some(
        ([row, column]) => row >= 14 && row < 21 && column >= 14 && column < 21,
      ),
    ).toBe(false);
  });

  it("CodewordをMatrixに配置できる", () => {
    const matrix = new QrMatrix(21);

    const coordinates = matrix.getDataCoordinates();

    matrix.placeData(new Uint8Array([0x80]));

    expect(matrix.get(...coordinates[0])).toBe(true);

    for (let i = 1; i < 8; i++) {
      expect(matrix.get(...coordinates[i])).toBe(false);
    }
  });

  it("Matrixに収まらないデータはエラーになる", () => {
    const matrix = new QrMatrix(21);

    const codewords = new Uint8Array(100);

    expect(() => {
      matrix.placeData(codewords);
    }).toThrow("Data does not fit in matrix");
  });

  it("データを配置した場所を判定できる", () => {
    const matrix = new QrMatrix(21);

    expect(matrix.isDataModule(20, 20)).toBe(false);

    matrix.placeDataBit(20, 20, true);

    expect(matrix.isDataModule(20, 20)).toBe(true);
  });

  it("固定パターンはデータモジュールとして扱わない", () => {
    const matrix = new QrMatrix(21);

    matrix.placeFinderPattern(0, 0);

    expect(matrix.isDataModule(0, 0)).toBe(false);
  });

  it("データ部分だけにMaskを適用できる", () => {
    const matrix = new QrMatrix(21);

    matrix.placeDataBit(20, 20, true);
    matrix.placeDataBit(20, 19, true);

    matrix.placeFinderPattern(0, 0);

    matrix.applyMask(0);

    // Mask 0:
    // (20 + 20) % 2 === 0 → 反転
    expect(matrix.get(20, 20)).toBe(false);

    // (20 + 19) % 2 !== 0 → そのまま
    expect(matrix.get(20, 19)).toBe(true);

    // Finder Patternは変更されない
    expect(matrix.get(0, 0)).toBe(true);
  });
});
