import { QrMatrix } from "./matrix.js";

export function renderSvg(matrix: QrMatrix, moduleSize = 10): string {
  const size = matrix.size;
  const svgSize = size * moduleSize;

  const rects: string[] = [];

  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const value = matrix.get(row, column);

      if (value !== true) {
        continue;
      }

      rects.push(
        `<rect x="${column * moduleSize}" y="${row * moduleSize}" width="${moduleSize}" height="${moduleSize}" />`,
      );
    }
  }

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}">`,
    `<rect width="100%" height="100%" fill="white" />`,
    `<g fill="black">`,
    ...rects,
    `</g>`,
    `</svg>`,
  ].join("");
}
