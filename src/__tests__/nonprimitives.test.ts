import * as tucson from "../index";

describe("object", () => {
  test("successfully decodes simple object", () => {
    expect(
      tucson.object({
        name: tucson.string,
        age: tucson.number,
      })({ name: "Paul", age: 14 }),
    ).toEqual({ type: "success", value: { name: "Paul", age: 14 } });
  });

  test("fails to decode simple object", () => {
    expect(
      tucson.object({
        name: tucson.string,
        age: tucson.number,
      })({ name: "Paul" }),
    ).toEqual({ type: "error", value: "error decoding field 'age': expected a number, received: undefined" });
  });

  test("fails to decode falsy values without runtime errors", () => {
    expect(
      tucson.object({
        name: tucson.string,
      })(null),
    ).toEqual({ type: "error", value: "" });
  });
});

describe("array", () => {
  test("successfully decodes array", () => {
    expect(tucson.array(tucson.string)(["a", "b", "c"])).toEqual({ type: "success", value: ["a", "b", "c"] });
  });

  test("fails to decode array with a single bad entry", () => {
    expect(tucson.array(tucson.string)(["a", 0, "c"])).toEqual({
      type: "error",
      value: "expected array item at index 1 to decode correctly, received: 0",
    });
  });

  test("fails to decode a falsy value without runtime errors", () => {
    expect(tucson.array(tucson.string)(null)).toEqual({ type: "error", value: "expected array, received: null" });
  });
});
