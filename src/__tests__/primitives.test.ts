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

describe("boolean", () => {
  test("successful boolean", () => {
    expect(tucson.boolean(false)).toEqual({ type: "success", value: false });
  });

  test("unsuccessful boolean", () => {
    expect(tucson.boolean(70)).toEqual({ type: "error", value: `expected a boolean, received: 70` });
  });
});

describe("null", () => {
  test("successful null", () => {
    expect(tucson.null(null)).toEqual(tucson.success(null));
  });

  test("unsuccessful null", () => {
    expect(tucson.null("Sales")).toEqual(tucson.error(`expected null, received: "Sales"`));
  });
});

describe("undefined", () => {
  test("successful undefined", () => {
    expect(tucson.undefined(undefined)).toEqual(tucson.success(undefined));
  });

  test("unsuccessful undefined", () => {
    expect(tucson.undefined("Sales")).toEqual(tucson.error(`expected undefined, received: "Sales"`));
  });
});

describe("literal", () => {
  test("successful literal", () => {
    expect(tucson.literal("Sales")("Sales")).toEqual(tucson.success("Sales"));
  });

  test("unsuccessful literal", () => {
    expect(tucson.literal("Sales")("Foo")).toEqual(tucson.error(`expected literal "Sales", received: "Foo"`));
  });
});
