import { Decoder, Result, error } from "./types";

/**
 * Decode a field inside an object.
 */
export const field = <T>(key: string, decoder: Decoder<T>): Decoder<T> => val =>
  val ? decoder(val[key]) : error("Value doesn't exist");

export const dictionary = <T>(decoder: Decoder<T>): Decoder<{ [key: string]: T }> => val => {
  if (!val || typeof val !== "object") {
    return {
      type: "error",
      value: "not an object",
    };
  }
  const res: { [key: string]: T } = {};
  // @todo use Object.keys and recursive helper like in `decodeArrayRecursive` below
  for (const key in val) {
    if (true) {
      const decoded = decoder(val[key]);
      if (decoded.type === "success") {
        res[key] = decoded.value as T;
      } else {
        return {
          type: "error",
          //@todo: add value
          value: "",
        };
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
      return {
        type: "error",
        value: "",
      };
    }
    const res: { [objectField in keyof T]?: T[objectField] } = {};
    // @todo use Object.keys and recursive helper like in `decodeArrayRecursive` below
    for (const key in objectFields) {
      const decoder = objectFields[key];
      const decoded = decoder(val[key]);
      if (decoded.type === "success") {
        res[key] = decoded.value;
      } else {
        return {
          type: "error",
          value: `error decoding field '${key}': ${decoded.value}`,
        };
      }
    }
    return {
      type: "success",
      value: res as T,
    };
  };
};

// Recursive helper to decode an array declaratively and exit early
const decodeArrayRecursive = <T>(decoder: Decoder<T>, values: any[], successValues: T[]): Result<T[]> => {
  if (values.length === 0) {
    return {
      type: "success",
      value: successValues,
    };
  }
  const [head, ...tail] = values;
  const decodedHead = decoder(head);
  return decodedHead.type === "error"
    ? error(
        `expected array item at index ${successValues.length} to decode correctly, received: ${JSON.stringify(head)}`,
      )
    : decodeArrayRecursive(decoder, tail, [...successValues, decodedHead.value]);
};

/**
 * Decode an array based on the decoder of its elements.
 */
export const array = <T>(decoder: Decoder<T>): Decoder<T[]> => {
  return values => {
    if (!Array.isArray(values)) {
      return error(`expected array, received: ${JSON.stringify(values)}`);
    }
    return decodeArrayRecursive(decoder, values, []);
  };
};
