import { describe, expect, it } from "vitest";
import { QrMatrix } from "./matrix.js";
import { renderSvg } from "./renderer.js";
import { generateQrMatrix } from "./qrCode.js";

describe("SVG Renderer", () => {
  it("MatrixをSVGに変換できる", () => {
    const matrix = new QrMatrix(21);

    matrix.set(0, 0, true);
    matrix.set(1, 1, false);

    const svg = renderSvg(matrix);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("<rect");
  });

  it("QR MatrixをSVGに変換できる", () => {
    const matrix = generateQrMatrix("Hello");

    const svg = renderSvg(matrix);

    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain("<rect");
  });
});
