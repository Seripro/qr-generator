import { add, multiply } from "./gf256.js";

export class Polynomial {
  constructor(public readonly coefficients: number[]) {}

  multiply(other: Polynomial): Polynomial {
    const result = new Array(
      this.coefficients.length + other.coefficients.length - 1,
    ).fill(0);

    for (let i = 0; i < this.coefficients.length; i++) {
      for (let j = 0; j < other.coefficients.length; j++) {
        result[i + j] = add(
          result[i + j],
          multiply(this.coefficients[i], other.coefficients[j]),
        );
      }
    }

    return new Polynomial(result);
  }
}
