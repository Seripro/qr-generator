import { exp } from "./gf256.js";
import { Polynomial } from "./polynomial.js";

export function createGeneratorPolynomial(
  errorCorrectionCodewords: number,
): Polynomial {
  let generator = new Polynomial([1]);

  for (let i = 0; i < errorCorrectionCodewords; i++) {
    const factor = new Polynomial([1, exp(i)]);

    generator = generator.multiply(factor);
  }

  return generator;
}

export function generateErrorCorrection(
  data: Uint8Array,
  errorCorrectionCodewords: number,
): Uint8Array {
  const generator = createGeneratorPolynomial(errorCorrectionCodewords);

  const message = new Polynomial([
    ...data,
    ...new Array(errorCorrectionCodewords).fill(0),
  ]);

  const remainder = new Polynomial([...message.coefficients]);

  for (let i = 0; i < data.length; i++) {
    const factor = remainder.coefficients[i];

    if (factor === 0) {
      continue;
    }

    const scaledGenerator = generator.scale(factor);

    for (let j = 0; j < scaledGenerator.coefficients.length; j++) {
      remainder.coefficients[i + j] ^= scaledGenerator.coefficients[j];
    }
  }

  return new Uint8Array(
    remainder.coefficients.slice(-errorCorrectionCodewords),
  );
}
