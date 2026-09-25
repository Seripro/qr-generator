export function encodeUtf8(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}
