import { describe, expect, it } from "vitest";
import { createGeneratorPolynomial } from "./reedSolomon.js";

describe("Reed-Solomon", () => {
  it("ECC 7個用のGenerator Polynomialを生成できる", () => {
    const generator = createGeneratorPolynomial(7);

    expect(generator.coefficients.length).toBe(8);
    expect(generator.coefficients[0]).toBe(1);
  });
});
