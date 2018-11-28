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
    ).toEqual({ type: "error", value: "expected field 'age' to decode correctly, received: undefined" });
  });
});
