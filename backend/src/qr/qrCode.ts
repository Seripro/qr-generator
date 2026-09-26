import { encodeCodewords } from "./encoder.js";
import { QrMatrix } from "./matrix.js";
import { chooseBestMask } from "./mask.js";
import { placeFormatInfo } from "./formatInfo.js";

export function generateQrMatrix(text: string): QrMatrix {
  // 1. Codewordsを作る
  const codewords = encodeCodewords(text);

  // 2. 空のMatrixを作る
  const matrix = new QrMatrix(21);

  // 3. Finder Pattern
  matrix.placeFinderPattern(0, 0);
  matrix.placeFinderPattern(0, 14);
  matrix.placeFinderPattern(14, 0);

  // 4. Separator
  matrix.placeSeparator(0, 0);
  matrix.placeSeparator(0, 14);
  matrix.placeSeparator(14, 0);

  // 5. Timing Pattern
  matrix.placeTimingPatterns();

  // 6. Dark Module
  matrix.placeDarkModule();

  // 7. Format Informationの場所を予約
  matrix.reserveFormatInformation();

  // 8. Dataを配置
  matrix.placeData(codewords);

  // 9. 8種類のMaskから最適なものを選ぶ
  const result = chooseBestMask(matrix);

  // 10. 選ばれたMask済みMatrixにFormat Informationを配置
  placeFormatInfo(result.matrix, "L", result.mask);

  return result.matrix;
}
