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
