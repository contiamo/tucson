import * as tuscon from "../index";

describe("string", () => {
  test("successful string", () => {
    expect(tuscon.string("something")).toEqual({ type: "success", value: "something" });
  });

  test("unsuccessful string", () => {
    expect(tuscon.string(0)).toEqual({ type: "error", value: "expected a string, received: 0" });
  });
});

describe("number", () => {
  test("successful number", () => {
    expect(tuscon.number(2)).toEqual({ type: "success", value: 2 });
  });

  test("unsuccessful number", () => {
    expect(tuscon.number("0")).toEqual({ type: "error", value: `expected a number, received: "0"` });
  });
});
