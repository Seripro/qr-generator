import { describe, expect, it } from "vitest";
import { QrMatrix } from "./matrix.js";
import {
  calculatePenaltyN1,
  calculatePenaltyN2,
  calculatePenaltyN3,
} from "./maskPenalty.js";

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

  describe("Mask Penalty N2", () => {
    it("2×2の同じ色のブロックで3点になる", () => {
      const matrix = new QrMatrix(21);

      matrix.set(0, 0, true);
      matrix.set(0, 1, true);
      matrix.set(1, 0, true);
      matrix.set(1, 1, true);

      expect(calculatePenaltyN2(matrix)).toBe(3);
    });

    it("2×2の白いブロックでも3点になる", () => {
      const matrix = new QrMatrix(21);

      matrix.set(0, 0, false);
      matrix.set(0, 1, false);
      matrix.set(1, 0, false);
      matrix.set(1, 1, false);

      expect(calculatePenaltyN2(matrix)).toBe(3);
    });

    it("2×2になっていなければ加点しない", () => {
      const matrix = new QrMatrix(21);

      matrix.set(0, 0, true);
      matrix.set(0, 1, true);
      matrix.set(1, 0, true);
      matrix.set(1, 1, false);

      expect(calculatePenaltyN2(matrix)).toBe(0);
    });
  });

  describe("Mask Penalty N3", () => {
    it("横方向のパターンを検出できる", () => {
      const matrix = new QrMatrix(21);

      // □□□□ ■ □ ■■■ □ ■ □□□□
      const pattern = [
        false,
        false,
        false,
        false,
        true,
        false,
        true,
        true,
        true,
        false,
        true,
        false,
        false,
        false,
        false,
      ];

      for (let column = 0; column < pattern.length; column++) {
        matrix.set(0, column, pattern[column]);
      }

      expect(calculatePenaltyN3(matrix)).toBe(40);
    });

    it("縦方向で前に白4個があるパターンを検出できる", () => {
      const matrix = new QrMatrix(21);

      const pattern = [
        false,
        false,
        false,
        false,
        true,
        false,
        true,
        true,
        true,
        false,
        true,
      ];

      for (let row = 0; row < pattern.length; row++) {
        matrix.set(row, 0, pattern[row]);
      }

      expect(calculatePenaltyN3(matrix)).toBe(40);
    });
  });

  it("前後に4個の白があるパターンを検出する", () => {
    const matrix = new QrMatrix(21);

    // □□□□ ■ □ ■■■ □ ■ □□□□
    const pattern = [
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
    ];

    for (let column = 0; column < pattern.length; column++) {
      matrix.set(0, column, pattern[column]);
    }

    expect(calculatePenaltyN3(matrix)).toBe(40);
  });

  it("前後に白4個がなくても基本パターンだけでは加点しない", () => {
    const matrix = new QrMatrix(21);

    // ■ □ ■■■ □ ■
    const pattern = [true, false, true, true, true, false, true];

    for (let column = 0; column < pattern.length; column++) {
      matrix.set(0, column, pattern[column]);
    }

    expect(calculatePenaltyN3(matrix)).toBe(0);
  });

  it("前に白4個がある1:1:3:1:1パターンで40点になる", () => {
    const matrix = new QrMatrix(21);

    const pattern = [
      false,
      false,
      false,
      false,
      true,
      false,
      true,
      true,
      true,
      false,
      true,
    ];

    for (let column = 0; column < pattern.length; column++) {
      matrix.set(0, column, pattern[column]);
    }

    expect(calculatePenaltyN3(matrix)).toBe(40);
  });

  it("後ろに白4個がある1:1:3:1:1パターンで40点になる", () => {
    const matrix = new QrMatrix(21);

    const pattern = [
      true,
      false,
      true,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
    ];

    for (let column = 0; column < pattern.length; column++) {
      matrix.set(0, column, pattern[column]);
    }

    expect(calculatePenaltyN3(matrix)).toBe(40);
  });

  it("前後に白4個がなければ加点しない", () => {
    const matrix = new QrMatrix(21);

    const pattern = [true, false, true, true, true, false, true];

    for (let column = 0; column < pattern.length; column++) {
      matrix.set(0, column, pattern[column]);
    }

    expect(calculatePenaltyN3(matrix)).toBe(0);
  });
});
