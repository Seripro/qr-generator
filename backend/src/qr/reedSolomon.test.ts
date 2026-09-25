import { describe, expect, it } from "vitest";
import {
  createGeneratorPolynomial,
  generateErrorCorrection,
} from "./reedSolomon.js";

describe("Reed-Solomon", () => {
  it("ECC 7個用のGenerator Polynomialを生成できる", () => {
    const generator = createGeneratorPolynomial(7);

    expect(generator.coefficients.length).toBe(8);
    expect(generator.coefficients[0]).toBe(1);
  });
  it("19個のData Codewordから7個のECCを生成できる", () => {
    const data = new Uint8Array(19);

    const ecc = generateErrorCorrection(data, 7);

    expect(ecc.length).toBe(7);
  });
});
