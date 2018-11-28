import * as tuscon from "../index";

describe("object", () => {
  test("successfully decodes simple object", () => {
    expect(
      tuscon.object({
        name: tuscon.string,
        age: tuscon.number,
      })({ name: "Paul", age: 14 }),
    ).toEqual({ type: "success", value: { name: "Paul", age: 14 } });
  });

  test("fails to decode simple object", () => {
    expect(
      tuscon.object({
        name: tuscon.string,
        age: tuscon.number,
      })({ name: "Paul" }),
    ).toEqual({ type: "error", value: "expected field 'age' to decode correctly, received: undefined" });
  });
});
