import { SafeInteger, StringEx, Uint8 } from "../deps.ts";

/**
 * 対応する基数
 *
 * @internal
 */
const _FORMAT_RADIXES = [2, 8, 10, 16] as const;

export namespace BytesFormat {
  /**
   * 2, 8, 10, or 16.
   */
  export type Radix = typeof _FORMAT_RADIXES[number];

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
     * | `radix` | default of `paddedLength` |
     * | ---: | ---: |
     * | `16` | `2` |
     * | `10` | `3` |
     * | `8` | `3` |
     * | `2` | `8` |
     */
    paddedLength?: number /* Integer */;

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
    const byteRegex = _createByteRegex(resolvedOptions);
    return _parse(formattedBytes, resolvedOptions, byteRegex);
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
    return _format(bytes, resolvedOptions);
  }
}

// class BytesFormat {
//   parse(formattedBytes: string): Uint8Array;
//   format(bytes: Uint8Array): string;
// }

/**
 * @internal
 */
function _isFormatRadix(value: unknown): value is BytesFormat.Radix {
  if (typeof value === "number") {
    return (_FORMAT_RADIXES as ReadonlyArray<number>).includes(value);
  }
  return false;
}

/**
 * `BytesFormat.Options`の各項目を省略不可にしたオプション
 *
 * @internal
 */
type _ResolvedFormatOptions = {
  /** 基数 */
  radix: BytesFormat.Radix;

  /** 前方埋め結果の文字列長 */
  paddedLength: SafeInteger;

  /** 16進数のa-fを小文字にするか否か */
  lowerCase: boolean;

  /** 各バイトのプレフィックス */
  prefix: string;

  /** 各バイトのサフィックス */
  suffix: string;

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
function _minPaddedLengthOf(radix: BytesFormat.Radix): SafeInteger {
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
 * @throws {TypeError} The `options.paddedLength` is not positive integer.
 * @throws {RangeError} The `options.paddedLength` is below the lower limit.
 */
function _resolveFormatOptions(
  options: BytesFormat.Options | _ResolvedFormatOptions = {},
): _ResolvedFormatOptions {
  if (_isFormatRadix(options.radix) || (options.radix === undefined)) {
    // ok
  } else {
    throw new TypeError("radix");
  }
  const radix: BytesFormat.Radix = _isFormatRadix(options.radix)
    ? options.radix
    : 16;

  if (
    SafeInteger.isPositiveSafeInteger(options.paddedLength) ||
    (options.paddedLength === undefined)
  ) {
    // ok
  } else {
    throw new TypeError("paddedLength");
  }
  const minPaddedLength = _minPaddedLengthOf(radix);
  const paddedLength = SafeInteger.fromNumber(
    options.paddedLength,
    {
      fallback: minPaddedLength,
      clampRange: [minPaddedLength, Number.MAX_SAFE_INTEGER],
    },
  );

  let lowerCase: boolean;
  if (typeof options.lowerCase === "boolean") {
    lowerCase = options.lowerCase;
  } else {
    lowerCase = false;
  }

  let prefix: string;
  if (typeof options.prefix === "string") {
    prefix = options.prefix;
  } else {
    prefix = "";
  }

  let suffix: string;
  if (typeof options.suffix === "string") {
    suffix = options.suffix;
  } else {
    suffix = "";
  }

  let separator: string;
  if (typeof options.separator === "string") {
    separator = options.separator;
  } else {
    separator = "";
  }

  return Object.freeze({
    radix,
    paddedLength,
    lowerCase,
    prefix,
    suffix,
    separator,
  });
}

/**
 * オプションどおりにフォーマットした1バイトを表す文字列にマッチする正規表現を生成
 *
 * @internal
 * @param resolvedOptions - オプション
 * @returns オプションから生成した正規表現
 */
function _createByteRegex(resolvedOptions: _ResolvedFormatOptions): RegExp {
  let charsPattern: string;
  switch (resolvedOptions.radix) {
    case 2:
      charsPattern = "[01]";
      break;
    case 8:
      charsPattern = "[0-7]";
      break;
    case 10:
      charsPattern = "[0-9]";
      break;
    case 16:
      charsPattern = "[0-9A-Fa-f]";
      break;
  }
  const bodyLength = _minPaddedLengthOf(resolvedOptions.radix);
  const paddingLength = resolvedOptions.paddedLength - bodyLength;
  const paddingPattern = (paddingLength > 0) ? `[0]{${paddingLength}}` : "";
  return new RegExp(`^${paddingPattern}${charsPattern}{${bodyLength}}$`);
}

function _parse(
  toParse: string,
  options: _ResolvedFormatOptions,
  byteRegex: RegExp,
): Uint8Array {
  let byteStringArray: Array<string>;
  if (options.separator.length > 0) {
    byteStringArray = toParse.split(options.separator);
    if (byteStringArray.length === 1 && byteStringArray[0] === "") {
      return new Uint8Array(0);
    }
  } else {
    const elementLength = options.paddedLength + options.prefix.length +
      options.suffix.length;
    byteStringArray = [...StringEx.segment(toParse, elementLength)];
  }

  return Uint8Array.from(byteStringArray, (byteString) => {
    return _parseByte(byteString, options, byteRegex);
  });
}

//TODO number-formatとして外に出す
/**
 * 1バイトを表す文字列を8-bit符号なし整数にパースし返却
 *
 * @internal
 * @param formatted - 文字列
 * @returns 8-bit符号なし整数
 * @throws {TypeError} The `formatted` does not match the specified format.
 */
function _parseByte(
  formatted: string,
  options: _ResolvedFormatOptions,
  byteRegex: RegExp,
): Uint8 {
  let work = formatted;

  if (options.prefix.length > 0) {
    if (work.startsWith(options.prefix)) {
      work = work.substring(options.prefix.length);
    } else {
      throw new TypeError("unprefixed");
    }
  }

  if (options.suffix.length > 0) {
    if (work.endsWith(options.suffix)) {
      work = work.substring(0, work.length - options.suffix.length);
    } else {
      throw new TypeError("unsuffixed");
    }
  }

  if (byteRegex.test(work) !== true) {
    throw new TypeError(`parse error: ${work}`);
  }

  const integer = Number.parseInt(work, options.radix);
  // if (isUint8(integer)) {
  return integer as Uint8; // regex.testがtrueならuint8のはず
  // }
  // else
}

function _format(
  bytes: Uint8Array,
  options: _ResolvedFormatOptions,
): string {
  const byteStringArray = [...bytes].map((byte) => {
    return _formatByte(byte as Uint8, options);
  });
  return byteStringArray.join(options.separator);
}

//TODO number-formatとして外に出す
/**
 * 8-bit符号なし整数を文字列にフォーマットし返却
 *
 * @internal
 * @param byte - 8-bit符号なし整数
 * @param options - オプション
 * @returns 文字列
 */
function _formatByte(byte: Uint8, options: _ResolvedFormatOptions): string {
  let str = byte.toString(options.radix);
  if (options.lowerCase !== true) {
    str = str.toUpperCase();
  }
  str = str.padStart(options.paddedLength, "0");
  return options.prefix + str + options.suffix;
}
