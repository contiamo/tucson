import { Decoder, DecodeError, Result, error, success } from "./types";

export const dictionary = <T>(decoder: Decoder<T>): Decoder<{ [key: string]: T }> => val => {
  if (!val || typeof val !== "object") {
    return error([
      {
        path: [],
        error: "expected dictionary",
        received: val,
      },
    ]);
  }
  const res: { [key: string]: T } = {};
  // @todo use Object.keys and recursive helper like in `decodeArrayRecursive` below
  for (const key in val) {
    if (true) {
      const decoded = decoder(val[key]);
      if (decoded.type === "success") {
        res[key] = decoded.value as T;
      } else {
        /**
         * @todo instead of exiting early, decode all members of the object in order to provide
         * all errors upfront. This is possible since the error is an array, and is crucial
         * for effective debugging in case the error occurred in production.
         */
        return error(
          decoded.value.map(decodeError => ({
            path: [key, ...decodeError.path],
            received: decodeError.received,
            error: decodeError.error,
          })),
        );
      }
    }
  }
  return {
    type: "success",
    value: res,
  };
};

/**
 * Decode a structured object, supplying decoders for each field in a correspondding key-value pair.
 * This is completely type-safe straight out of TypeScript language features.
 */
export const object = <T>(objectFields: { [objectField in keyof T]: Decoder<T[objectField]> }): Decoder<T> => {
  return val => {
    if (!val) {
      return error([
        {
          path: [],
          error: "expected object",
          received: val,
        },
      ]);
    }
    const res: { [objectField in keyof T]?: T[objectField] } = {};
    // @todo use Object.keys and recursive helper like in `decodeArrayRecursive` below
    for (const key in objectFields) {
      const decoder = objectFields[key];
      const decoded = decoder(val[key]);
      if (decoded.type === "success") {
        res[key] = decoded.value;
      } else {
        return error(
          decoded.value.map(decodeError => ({
            path: [key, ...decodeError.path],
            error: decodeError.error,
            received: decodeError.received,
          })),
        );
      }
    }
    return {
      type: "success",
      value: res as T,
    };
  };
};

/**
 * Recursive helper to decode an array declaratively and exit early
 * @todo instead of exiting early, decode all members of the array in order to provide
 * all errors upfront. This is possible since the error is an array, and is crucial
 * for effective debugging in case the error occurred in production.
 */
const decodeArrayRecursive = <T>(
  decoder: Decoder<T>,
  values: any[],
  successValues: T[],
): Result<DecodeError[], T[]> => {
  if (values.length === 0) {
    return success(successValues);
  }
  const [head, ...tail] = values;
  const decodedHead = decoder(head);
  return decodedHead.type === "error"
    ? error(
        decodedHead.value.map(decodeError => ({
          path: [String(successValues.length), ...decodeError.path],
          error: decodeError.error,
          received: decodeError.received,
        })),
      )
    : decodeArrayRecursive(decoder, tail, [...successValues, decodedHead.value]);
};

/**
 * Decode an array based on the decoder of its elements.
 */
export const array = <T>(decoder: Decoder<T>): Decoder<T[]> => val =>
  Array.isArray(val)
    ? decodeArrayRecursive(decoder, val, [])
    : error([
        {
          path: [],
          error: "expected array",
          received: val,
        },
      ]);
