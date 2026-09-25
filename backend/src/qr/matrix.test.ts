import { describe, expect, it } from "vitest";
import { QrMatrix } from "./matrix.js";

describe("QrMatrix", () => {
  it("21×21のマトリクスを作成できる", () => {
    const matrix = new QrMatrix(21);

    expect(matrix.size).toBe(21);
    expect(matrix.modules.length).toBe(21);
    expect(matrix.modules[0].length).toBe(21);
  });

  it("初期状態ではすべて未配置である", () => {
    const matrix = new QrMatrix(21);

    expect(matrix.get(0, 0)).toBeNull();
    expect(matrix.get(10, 10)).toBeNull();
    expect(matrix.get(20, 20)).toBeNull();
  });

  it("マスを設定できる", () => {
    const matrix = new QrMatrix(21);

    matrix.set(5, 10, true);

    expect(matrix.get(5, 10)).toBe(true);
  });
});
