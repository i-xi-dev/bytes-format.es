import { assertStrictEquals, assertThrows } from "./deps.ts";
import { BytesFormat } from "../mod.ts";

Deno.test("BytesFormat.format(Uint8Array)", () => {
  assertStrictEquals(BytesFormat.format(Uint8Array.of()), "");
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3)),
    "FFFEFDFC00010203",
  );
});

Deno.test("BytesFormat.format(Uint8Array, {radix:16})", () => {
  assertStrictEquals(BytesFormat.format(Uint8Array.of(), { radix: 16 }), "");
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      radix: 16,
    }),
    "FFFEFDFC00010203",
  );
});

Deno.test("BytesFormat.format(Uint8Array, {radix:*})", () => {
  // assertThrows(
  //   () => {
  //     BytesFormat.format(Uint8Array.of(), {
  //       radix: 1.5 as unknown as BytesFormat.Radix,
  //     });
  //   },
  //   TypeError,
  //   "radix",
  // );
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(10), {
      radix: 1.5 as unknown as 2,
    }),
    "0A",
  );

  // assertThrows(
  //   () => {
  //     BytesFormat.format(Uint8Array.of(), {
  //       radix: 15 as unknown as BytesFormat.Radix,
  //     });
  //   },
  //   TypeError,
  //   "radix",
  // );
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(10), {
      radix: 1.5 as unknown as 2,
    }),
    "0A",
  );

  // assertThrows(
  //   () => {
  //     BytesFormat.format(Uint8Array.of(), {
  //       radix: "1" as unknown as BytesFormat.Radix,
  //     });
  //   },
  //   TypeError,
  //   "radix",
  // );
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(10), {
      radix: "1" as unknown as 2,
    }),
    "0A",
  );
});

Deno.test("BytesFormat.format(Uint8Array, {radix:10})", () => {
  assertStrictEquals(BytesFormat.format(Uint8Array.of(), { radix: 10 }), "");
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      radix: 10,
    }),
    "255254253252000001002003",
  );
});

Deno.test("BytesFormat.format(Uint8Array, {radix:8})", () => {
  assertStrictEquals(BytesFormat.format(Uint8Array.of(), { radix: 8 }), "");
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      radix: 8,
    }),
    "377376375374000001002003",
  );
});

Deno.test("BytesFormat.format(Uint8Array, {radix:2})", () => {
  assertStrictEquals(BytesFormat.format(Uint8Array.of(), { radix: 2 }), "");
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      radix: 2,
    }),
    "1111111111111110111111011111110000000000000000010000001000000011",
  );
});

Deno.test("BytesFormat.format(Uint8Array, {lowerCase:true})", () => {
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(), { lowerCase: true }),
    "",
  );
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      lowerCase: true,
    }),
    "fffefdfc00010203",
  );
});

Deno.test("BytesFormat.format(Uint8Array, {minIntegralDigits:4})", () => {
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(), { minIntegralDigits: 4 }),
    "",
  );
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      minIntegralDigits: 4,
    }),
    "00FF00FE00FD00FC0000000100020003",
  );
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      minIntegralDigits: 3,
    }),
    "0FF0FE0FD0FC000001002003",
  );
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      minIntegralDigits: 2,
    }),
    "FFFEFDFC00010203",
  );
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      minIntegralDigits: 1,
    }),
    "FFFEFDFC00010203",
  );

  // assertThrows(
  //   () => {
  //     BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
  //       minIntegralDigits: 0,
  //     });
  //   },
  //   TypeError,
  //   "minIntegralDigits",
  // );
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      minIntegralDigits: 0,
    }),
    "FFFEFDFC00010203",
  );

  // assertThrows(
  //   () => {
  //     BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
  //       minIntegralDigits: 1.5,
  //     });
  //   },
  //   TypeError,
  //   "minIntegralDigits",
  // );
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      minIntegralDigits: 1.5,
    }),
    "FFFEFDFC00010203",
  );

  // assertThrows(
  //   () => {
  //     BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
  //       minIntegralDigits: "1" as unknown as number,
  //     });
  //   },
  //   TypeError,
  //   "minIntegralDigits",
  // );
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      minIntegralDigits: "1" as unknown as number,
    }),
    "FFFEFDFC00010203",
  );
});

Deno.test("BytesFormat.format(Uint8Array, {prefix:string})", () => {
  assertStrictEquals(BytesFormat.format(Uint8Array.of(), { prefix: "x" }), "");
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      prefix: "x",
    }),
    "xFFxFExFDxFCx00x01x02x03",
  );
});

Deno.test("BytesFormat.format(Uint8Array, {suffix:string})", () => {
  assertStrictEquals(BytesFormat.format(Uint8Array.of(), { suffix: "x" }), "");
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      suffix: "x",
    }),
    "FFxFExFDxFCx00x01x02x03x",
  );
});

Deno.test("BytesFormat.format(Uint8Array, {separator:string})", () => {
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(), { separator: "  " }),
    "",
  );
  assertStrictEquals(
    BytesFormat.format(Uint8Array.of(255, 254, 253, 252, 0, 1, 2, 3), {
      separator: "  ",
    }),
    "FF  FE  FD  FC  00  01  02  03",
  );
});

Deno.test("BytesFormat.parse(string)", () => {
  assertStrictEquals(JSON.stringify([...BytesFormat.parse("")]), "[]");
  assertStrictEquals(
    JSON.stringify([...BytesFormat.parse("FFFEFDFC00010203")]),
    "[255,254,253,252,0,1,2,3]",
  );
});

Deno.test("BytesFormat.parse(string, {radix:16})", () => {
  assertStrictEquals(
    JSON.stringify([...BytesFormat.parse("", { radix: 16 })]),
    "[]",
  );
  assertStrictEquals(
    JSON.stringify([...BytesFormat.parse("FFFEFDFC00010203", { radix: 16 })]),
    "[255,254,253,252,0,1,2,3]",
  );
  assertStrictEquals(
    JSON.stringify([...BytesFormat.parse("fffefdfc00010203", { radix: 16 })]),
    "[255,254,253,252,0,1,2,3]",
  );
});

Deno.test("BytesFormat.parse(string, {radix:10})", () => {
  assertStrictEquals(
    JSON.stringify([...BytesFormat.parse("", { radix: 10 })]),
    "[]",
  );
  assertStrictEquals(
    JSON.stringify([
      ...BytesFormat.parse("255254253252000001002003", { radix: 10 }),
    ]),
    "[255,254,253,252,0,1,2,3]",
  );

  assertThrows(
    () => {
      BytesFormat.parse("0311F", { radix: 10 });
    },
    TypeError,
    "parse error: 1F",
  );
});

Deno.test("BytesFormat.parse(string, {radix:8})", () => {
  assertStrictEquals(
    JSON.stringify([...BytesFormat.parse("", { radix: 8 })]),
    "[]",
  );
  assertStrictEquals(
    JSON.stringify([
      ...BytesFormat.parse("377376375374000001002003", { radix: 8 }),
    ]),
    "[255,254,253,252,0,1,2,3]",
  );
});

Deno.test("BytesFormat.parse(string, {radix:2})", () => {
  assertStrictEquals(
    JSON.stringify([...BytesFormat.parse("", { radix: 2 })]),
    "[]",
  );
  assertStrictEquals(
    JSON.stringify([
      ...BytesFormat.parse(
        "1111111111111110111111011111110000000000000000010000001000000011",
        { radix: 2 },
      ),
    ]),
    "[255,254,253,252,0,1,2,3]",
  );
});

Deno.test("BytesFormat.parse(string, {lowerCase:true})", () => {
  assertStrictEquals(
    JSON.stringify([...BytesFormat.parse("", { lowerCase: true })]),
    "[]",
  );
  assertStrictEquals(
    JSON.stringify([
      ...BytesFormat.parse("FFFEFDFC00010203", { lowerCase: true }),
    ]),
    "[255,254,253,252,0,1,2,3]",
  );
  assertStrictEquals(
    JSON.stringify([
      ...BytesFormat.parse("fffefdfc00010203", { lowerCase: true }),
    ]),
    "[255,254,253,252,0,1,2,3]",
  );
});

Deno.test("BytesFormat.parse(string, {minIntegralDigits:4})", () => {
  assertStrictEquals(
    JSON.stringify([...BytesFormat.parse("", { minIntegralDigits: 4 })]),
    "[]",
  );
  assertStrictEquals(
    JSON.stringify([
      ...BytesFormat.parse("00FF00FE00FD00FC0000000100020003", {
        minIntegralDigits: 4,
      }),
    ]),
    "[255,254,253,252,0,1,2,3]",
  );
});

Deno.test("BytesFormat.parse(string, {prefix:string})", () => {
  assertStrictEquals(
    JSON.stringify([...BytesFormat.parse("", { prefix: "x" })]),
    "[]",
  );
  assertStrictEquals(
    JSON.stringify([
      ...BytesFormat.parse("xFFxFExFDxFCx00x01x02x03", { prefix: "x" }),
    ]),
    "[255,254,253,252,0,1,2,3]",
  );

  assertThrows(
    () => {
      BytesFormat.parse("xFFyFE", { prefix: "x" });
    },
    TypeError,
    "unprefixed",
  );

  assertThrows(
    () => {
      BytesFormat.parse("xFFFE", { prefix: "x" });
    },
    TypeError,
    "unprefixed",
  );
});

Deno.test("BytesFormat.parse(string, {suffix:string})", () => {
  assertStrictEquals(
    JSON.stringify([...BytesFormat.parse("", { suffix: "x" })]),
    "[]",
  );
  assertStrictEquals(
    JSON.stringify([
      ...BytesFormat.parse("FFxFExFDxFCx00x01x02x03x", { suffix: "x" }),
    ]),
    "[255,254,253,252,0,1,2,3]",
  );

  assertThrows(
    () => {
      BytesFormat.parse("FFxFEy", { suffix: "x" });
    },
    TypeError,
    "unsuffixed",
  );

  assertThrows(
    () => {
      BytesFormat.parse("FFxFE", { suffix: "x" });
    },
    TypeError,
    "unsuffixed",
  );
});

Deno.test("BytesFormat.parse(string, {separator:string})", () => {
  assertStrictEquals(
    JSON.stringify([...BytesFormat.parse("", { separator: "  " })]),
    "[]",
  );
  assertStrictEquals(
    JSON.stringify([
      ...BytesFormat.parse("FF  FE  FD  FC  00  01  02  03", {
        separator: "  ",
      }),
    ]),
    "[255,254,253,252,0,1,2,3]",
  );
});
