import { describe, expect, it } from "vitest";
import { QrMatrix } from "./matrix.js";
import { calculatePenaltyN1 } from "./maskPenalty.js";

describe("Mask Penalty N1", () => {
  it("同じ色が5個連続すると3点になる", () => {
    const matrix = new QrMatrix(21);

    for (let column = 0; column < 5; column++) {
      matrix.set(0, column, true);
    }

    expect(calculatePenaltyN1(matrix)).toBe(3);
  });

  it("同じ色が6個連続すると4点になる", () => {
    const matrix = new QrMatrix(21);

    for (let column = 0; column < 6; column++) {
      matrix.set(0, column, true);
    }

    expect(calculatePenaltyN1(matrix)).toBe(4);
  });

  it("縦方向も評価する", () => {
    const matrix = new QrMatrix(21);

    for (let row = 0; row < 5; row++) {
      matrix.set(row, 0, true);
    }

    expect(calculatePenaltyN1(matrix)).toBe(3);
  });
});
