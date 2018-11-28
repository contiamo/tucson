import { Decoder } from "./types";

/**
 * Make a decoder optional, succeeding immediately with `undefined` if the value
 * is `undefined` in the first place. If not, the decoder is applied as normal.
 */
export const optional = <T>(decoder: Decoder<T>): Decoder<T | undefined> => val => {
  if (!val) {
    return { type: "success", value: undefined };
  }
  return decoder(val);
};

/**
 * Try multiple decoders, returning the output of the first one that succeeds.
 * If none of them succeed, an error is returned.
 */
export const oneOf = <T>(decoders: Array<Decoder<T>>): Decoder<T> => {
  return val => {
    for (const decoder of decoders) {
      const decoded = decoder(val);
      if (decoded.type === "success") {
        return decoded;
      }
    }
    return {
      type: "error",
      value: "No decoder matched the validated field",
    };
  };
};

/**
 * A lazily defined decoder that sits simply behind a function call.
 * This is used to define decoders recursively, which the JS runtime would not allow normally
 * (a function cannot be called directly inside its definition).
 */
export const lazy = <T>(fn: () => Decoder<T>): Decoder<T> => {
  return val => {
    const decoder = fn();
    return decoder(val);
  };
};

/**
 * Maps the successs result of a decoder to another value. Nothing happens if the decoder fails.
 */
export const map = <T1, T2>(decoder1: Decoder<T1>, fn: (t1: T1) => T2): Decoder<T2> => {
  return val => {
    const decoded1 = decoder1(val);
    if (decoded1.type === "success") {
      return {
        type: "success",
        value: fn(decoded1.value),
      };
    }
    return decoded1;
  };
};

/**
 * Creates a decoder that is dependant on the result of another decoder. This method is extremely
 * flexible and is a building block for decoding things like union types. See ./examples/flatMap.ts for
 * an incrementally complicated list of examples.
 */
export const flatMap = <T1, T2>(decoder1: Decoder<T1>, fn: (val1: T1) => Decoder<T2>) => (val: any) => {
  const decoded1 = decoder1(val);
  if (decoded1.type === "error") {
    return decoded1;
  }
  const decoder2 = fn(decoded1.value);
  return decoder2(val);
};

/**
 * Apply two decoders and combine their results.
 */
export const map2 = <T1, T2, T3>(
  decoder1: Decoder<T1>,
  decoder2: Decoder<T2>,
  fn: (t1: T1) => (t2: T2) => T3,
): Decoder<T3> => {
  return val => {
    const decoded1 = decoder1(val);
    const decoded2 = decoder2(val);
    if (decoded1.type === "success" && decoded2.type === "success") {
      const mappedValue: T3 = fn(decoded1.value)(decoded2.value);
      return {
        type: "success",
        value: mappedValue,
      };
    }
    if (decoded1.type === "error") {
      return decoded1;
    }
    if (decoded2.type === "error") {
      return decoded2;
    }
    return {
      type: "error",
      value: "impossible error",
    };
  };
};

/**
 * Apply three decoders and combine their results.
 */
export const map3 = <T1, T2, T3, T4>(
  decoder1: Decoder<T1>,
  decoder2: Decoder<T2>,
  decoder3: Decoder<T3>,
  fn: (t1: T1, t2: T2, t3: T3) => T4,
): Decoder<T4> => {
  return val => {
    const decoded1 = decoder1(val);
    const decoded2 = decoder2(val);
    const decoded3 = decoder3(val);
    if (decoded1.type === "success" && decoded2.type === "success" && decoded3.type === "success") {
      const mappedValue: T4 = fn(decoded1.value, decoded2.value, decoded3.value);
      return {
        type: "success",
        value: mappedValue,
      };
    }
    if (decoded1.type === "error") {
      return decoded1;
    }
    if (decoded2.type === "error") {
      return decoded2;
    }
    if (decoded3.type === "error") {
      return decoded3;
    }
    return {
      type: "error",
      value: "impossible error",
    };
  };
};
