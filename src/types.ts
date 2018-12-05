export type Result<T> = { type: "error"; value: string } | { type: "success"; value: T };

/**
 * Successful result constructor
 */
export const success = <T>(value: T): Result<T> => ({
  type: "success",
  value,
});

/**
 * Error result constructor
 */
export const error = <T>(value: string): Result<T> => ({
  type: "error",
  value,
});

export type Decoder<T> = (a: any) => Result<T>;
