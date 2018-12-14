export type Result<E, T> = { type: "error"; value: E } | { type: "success"; value: T };

/**
 * Successful result constructor
 */
export const success = <E, T>(value: T): Result<E, T> => ({
  type: "success",
  value,
});

/**
 * Error result constructor
 */
export const error = <E, T>(value: E): Result<E, T> => ({
  type: "error",
  value,
});

/**
 * Decoder error
 */
export interface DecodeError {
  path: string[];
  received: any;
  error: string;
}

export type Decoder<T> = (a: any) => Result<DecodeError[], T>;
