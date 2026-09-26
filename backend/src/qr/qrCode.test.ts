import { describe, expect, it } from "vitest";
import { generateQrMatrix } from "./qrCode.js";

describe("QR Code", () => {
  it("文字列から21×21のQR Matrixを生成できる", () => {
    const matrix = generateQrMatrix("Hello");

    expect(matrix.size).toBe(21);
  });

  it("生成されたMatrixにnullが残っていない", () => {
    const matrix = generateQrMatrix("Hello");

    for (let row = 0; row < matrix.size; row++) {
      for (let column = 0; column < matrix.size; column++) {
        expect(matrix.get(row, column)).not.toBeNull();
      }
    }
  });

  it("HelloのQR Matrixを生成できる", () => {
    const matrix = generateQrMatrix("Hello");

    for (let row = 0; row < matrix.size; row++) {
      let line = "";

      for (let column = 0; column < matrix.size; column++) {
        line += matrix.get(row, column) ? "██" : "  ";
      }

      console.log(line);
    }
  });
});
