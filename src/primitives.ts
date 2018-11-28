import { Decoder } from "./types";

/**
 * Create a decoder that always succeeds with a given constant value.
 * See ./examples/flatMap.ts to see why this is useful.
 */
export const succeed = <T>(succeedValue: T): Decoder<T> => _ => ({
  type: "success",
  value: succeedValue,
});

/**
 * Create a decoder that always fails with a given error (this is optional).
 * See ./examples/flatMap.ts to see why this is useful.
 */
export const fail = <T>(error: string = "Failure"): Decoder<T> => _ => ({
  type: "error",
  value: error,
});

/**
 * Create a decoder that always succeeds with value it decodes, leaving it as an `any` type.
 */
export const any: Decoder<any> = val => ({
  type: "success",
  value: val,
});

/**
 * Decode a string
 */
export const string: Decoder<string> = val => {
  if (typeof val === "string") {
    return {
      type: "success",
      value: val,
    };
  }
  return {
    type: "error",
    value: `expected a string, received: ${JSON.stringify(val)}`,
  };
};

/**
 * Decode a number.
 * This library doesn't distinguish between integers and floats as primitives,
 * since these types do not exist on TypeScript. Use `flatMap` to add additional
 * validations for floating point numbers.
 */
export const number: Decoder<number> = val => {
  if (typeof val === "number") {
    return {
      type: "success",
      value: val,
    };
  }
  return {
    type: "error",
    value: 'expected a number, received: "0"',
  };
};

/**
 * Decode a boolean
 */
export const boolean: Decoder<boolean> = val => {
  if (typeof val === "boolean") {
    return {
      type: "success",
      value: val,
    };
  }
  return {
    type: "error",
    value: "Not a number",
  };
};
