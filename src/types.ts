export type Result<T> = { type: "success"; value: T } | { type: "error"; value: string };

export type Decoder<T> = (a: any) => Result<T>;
