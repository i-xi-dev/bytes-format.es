//TODO

export function _isPositiveInteger(value: unknown): boolean {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value > 0;
  }
  return false;
}

export function* _segmentString(
  str: string,
  segmentCharCount: number, /* int */
): Generator<string, void, void> {
  for (let i = 0; i < str.length; i = i + segmentCharCount) {
    yield str.substring(i, i + segmentCharCount);
  }
}
