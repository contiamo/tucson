import * as tucson from "../index";

describe("string", () => {
  test("successful string", () => {
    expect(tucson.string("something")).toEqual({ type: "success", value: "something" });
  });

  test("unsuccessful string", () => {
    expect(tucson.string(0)).toEqual({ type: "error", value: "expected a string, received: 0" });
  });
});

describe("number", () => {
  test("successful number", () => {
    expect(tucson.number(2)).toEqual({ type: "success", value: 2 });
  });

  test("unsuccessful number", () => {
    expect(tucson.number("0")).toEqual({ type: "error", value: `expected a number, received: "0"` });
  });
});
