import { describe, expect, it } from "vitest";
import { Polynomial } from "./polynomial.js";

describe("Polynomial", () => {
  it("Polynomial同士を掛け算できる", () => {
    const a = new Polynomial([1, 2]);
    const b = new Polynomial([1, 3]);

    const result = a.multiply(b);

    expect(result.coefficients).toEqual([1, 1, 6]);
  });
});
