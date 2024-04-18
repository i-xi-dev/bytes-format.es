import { Radix, SafeInteger, SafeIntegerFormat, StringEx } from "../deps.ts";

/**
 * 対応する基数
 *
 * @internal
 */
const _FORMAT_RADIXES = [2, 8, 10, 16] as const;

export namespace BytesFormat {
  /**
   * The object with the following optional fields.
   */
  export type Options = {
    /**
     * The radix of the formatted string.
     * 2, 8, 10, and 16 are available values.
     * The default is `16`.
     */
    radix?: Radix;

    /**
     * The length of the `"0"` padded formatted string for each byte.
     * The default is determined by `radix`.
     *
     * | `radix` | default of `minIntegralDigits` |
     * | ---: | ---: |
     * | `16` | `2` |
     * | `10` | `3` |
     * | `8` | `3` |
     * | `2` | `8` |
     */
    minIntegralDigits?: number /* Integer */;

    /**
     * Whether the formatted string is lowercase or not.
     * The default is `false`.
     */
    lowerCase?: boolean;

    /**
     * The prefix of the formatted string for each byte.
     * The default is `""`.
     */
    prefix?: string;

    /**
     * The suffix of the formatted string for each byte.
     * The default is `""`.
     */
    suffix?: string;

    /**
     * The separator between the formatted strings of each byte.
     * The default is `""`.
     */
    separator?: string;
  };

  /**
   * @param formattedBytes - The formatted string represents a byte sequence.
   * @param options
   * @returns The byte sequence represented by `formattedBytes`.
   * @throws {TypeError} The `formattedBytes` contains the character sequence that does not match the specified format.
   */
  export function parse(
    formattedBytes: string,
    options?: BytesFormat.Options,
  ): Uint8Array {
    const resolvedOptions = _resolveFormatOptions(options);

    let byteStringArray: Array<string>;
    if (resolvedOptions.separator.length > 0) {
      byteStringArray = formattedBytes.split(resolvedOptions.separator);
      if (byteStringArray.length === 1 && byteStringArray[0] === "") {
        return new Uint8Array(0);
      }
    } else {
      const elementLength = resolvedOptions.minIntegralDigits +
        resolvedOptions.prefix.length +
        resolvedOptions.suffix.length;
      byteStringArray = [...StringEx.segment(formattedBytes, elementLength)];
    }

    return Uint8Array.from(byteStringArray, (byteString) => {
      return SafeIntegerFormat.parse(byteString, resolvedOptions);
    });
  }

  /**
   * @param bytes - The byte sequence.
   * @param options
   * @returns The formatted string represents a byte sequence.
   */
  export function format(
    bytes: Uint8Array,
    options?: BytesFormat.Options,
  ): string {
    const resolvedOptions = _resolveFormatOptions(options);

    const byteStringArray = [...bytes].map((byte) => {
      return SafeIntegerFormat.format(byte, resolvedOptions);
    });
    return byteStringArray.join(resolvedOptions.separator);
  }
}

/**
 * `BytesFormat.Options`の各項目を省略不可にしたオプション
 *
 * @internal
 */
type _ResolvedFormatOptions = SafeIntegerFormat.Options.Resolved & {
  /** 各バイトの連結子 */
  separator: string;
};

/**
 * フォーマット基数に応じた前方ゼロ埋め結果の最小文字列長を返却
 *
 * @internal
 * @param radix - フォーマット基数
 * @returns フォーマット結果の前方ゼロ埋め結果の最小文字列長
 */
function _minPaddedLengthOf(radix: Radix): SafeInteger {
  switch (radix) {
    case 2:
      return 8;
    case 8:
      return 3;
    case 10:
      return 3;
    case 16:
      return 2;
      // default:
      //   return -1 as never;
  }
}

/**
 * オプションの省略項目にデフォルト値をセットした`_ResolvedFormatOptions`を返却
 *
 * @internal
 * @param options - 省略項目があるかもしれないオプション
 * @returns 省略項目なしオプション
 * @throws {TypeError} The `options.radix` is not 2, 8, 10, or 16.
 * @throws {TypeError} The `options.minIntegralDigits` is not positive integer.
 * @throws {RangeError} The `options.minIntegralDigits` is below the lower limit.
 */
function _resolveFormatOptions(
  options: BytesFormat.Options | _ResolvedFormatOptions = {},
): _ResolvedFormatOptions {
  const radix = Object.values(Radix).includes(options.radix as Radix)
    ? options.radix
    : Radix.HEXADECIMAL;

  let minIntegralDigits = _minPaddedLengthOf(radix as Radix);
  try {
    minIntegralDigits = SafeInteger.fromNumber(options.minIntegralDigits, {
      clampRange: [minIntegralDigits, Number.MAX_SAFE_INTEGER],
      fallback: minIntegralDigits,
    });
  } catch {
    // options.minIntegralDigitsがnumber?ではない場合
    // minIntegralDigitsはそのまま
  }

  const byteFormatOptions = SafeIntegerFormat.Options.resolve({
    radix,
    minIntegralDigits,
    lowerCase: options.lowerCase,
    prefix: options.prefix,
    suffix: options.suffix,
  });

  let separator: string;
  if (typeof options.separator === "string") {
    separator = options.separator;
  } else {
    separator = "";
  }

  return {
    ...byteFormatOptions,
    separator,
  };
}
