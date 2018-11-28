import { Decoder, Result } from "./types";

/**
 * Decode a field inside an object.
 */
export const field = <T>(key: string, decoder: Decoder<T>): Decoder<T> => {
  return val => {
    if (!val) {
      return {
        type: "error",
        value: "Value doesn't exist",
      };
    }
    return decoder(val[key]);
  };
};

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
      if (true) {
        const decoder = objectFields[key];
        const decoded = decoder(val[key]);
        if (decoded.type === "success") {
          res[key] = decoded.value;
        } else {
          return {
            type: "error",
            value: `expected field '${key}' to decode correctly, received: ${JSON.stringify(val[key])}`,
          };
        }
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
      value: successValues
    }
  }
  const [head, ...tail] = values
  const decodedHead = decoder(head)
  if (decodedHead.type === "error") {
    return {
      type: "error",
      value: `expected array item at index ${successValues.length} to decode correctly, received: ${JSON.stringify(head)}`
    }
  }
  return decodeArrayRecursive(decoder, tail, [ ...successValues, decodedHead.value ])
}

/**
 * Decode an array based on the decoder of its elements.
 */
export const array = <T>(decoder: Decoder<T>): Decoder<T[]> => {
  return values => {
    if (!Array.isArray(values)) {
      return {
        type: "error",
        value: `expected array, received: ${JSON.stringify(values)}`,
      };
    }
    return decodeArrayRecursive(decoder, values, [])
  };
};
