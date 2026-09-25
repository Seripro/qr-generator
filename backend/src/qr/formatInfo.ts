export function calculateFormatInfo(
  errorCorrectionLevel: "L" | "M" | "Q" | "H",
  mask: number,
): number {
  const errorCorrectionBits = {
    L: 0b01,
    M: 0b00,
    Q: 0b11,
    H: 0b10,
  }[errorCorrectionLevel];

  const data = (errorCorrectionBits << 3) | mask;

  let value = data << 10;

  const generator = 0b10100110111;

  for (let i = 14; i >= 10; i--) {
    if ((value & (1 << i)) !== 0) {
      value ^= generator << (i - 10);
    }
  }

  const formatInfo = ((data << 10) | value) ^ 0b101010000010010;

  return formatInfo;
}
