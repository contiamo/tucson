import { Decoder, success, error } from "./types";

/**
 * Create a decoder that always succeeds with a given constant value.
 * See ./examples/flatMap.ts to see why this is useful.
 */
export const succeed = <T>(value: T): Decoder<T> => _ => success(value);

/**
 * Create a decoder that always fails with a given error (this is optional).
 * See ./examples/flatMap.ts to see why this is useful.
 */
export const fail = <T>(errorMsg: string = "Failure"): Decoder<T> => _ => error(errorMsg);

/**
 * Create a decoder that always succeeds with value it decodes, leaving it as an `any` type.
 */
export const any: Decoder<any> = val => ({
  type: "success",
  value: val,
});

/**
 * Decodes a type literal (constant value)
 */
export const literal = <T extends string | boolean | number>(literal: T): Decoder<T> => val =>
  val === literal
    ? success(literal)
    : error(`expected literal ${JSON.stringify(literal)}, received: ${JSON.stringify(val)}`);
/**
 * Decode a string
 */
export const string: Decoder<string> = val =>
  typeof val === "string" ? success(val) : error(`expected a string, received: ${JSON.stringify(val)}`);

/**
 * Decode a number.
 * This library doesn't distinguish between integers and floats as primitives,
 * since these types do not exist on TypeScript. Use `flatMap` to add additional
 * validations for floating point numbers.
 */
export const number: Decoder<number> = val =>
  typeof val === "number" ? success(val) : error(`expected a number, received: ${JSON.stringify(val)}`);

/**
 * Decode a boolean
 */
export const boolean: Decoder<boolean> = val =>
  typeof val === "boolean" ? success(val) : error(`expected a boolean, received: ${JSON.stringify(val)}`);

/**
 * Decode a null value. This is named `nullDecoder` instead of `null` to not override the global value.
 * Recommended usage outside the library would be `tucson.null`.
 */
export const nullDecoder: Decoder<null> = val =>
  val === null ? success(val) : error(`expected null, received: ${JSON.stringify(val)}`);
