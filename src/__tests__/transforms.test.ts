import * as tuscon from "../index";

describe("map", () => {
  test("maps over a successful decode", () => {
    expect(tuscon.map(tuscon.string, Number)("0")).toEqual({ type: "success", value: 0 });
  });

  test("keeps an unsuccessful decode intact", () => {
    expect(tuscon.map(tuscon.string, Number)(0)).toEqual({ type: "error", value: "expected a string, received: 0" });
  });
});

describe("flatMap", () => {
  test("flatmaps over a successful decode", () => {
    expect(
      tuscon.flatMap(tuscon.string, str => {
        if (str.length < 10) {
          return tuscon.succeed(str);
        }
        return tuscon.fail("too long");
      })("0"),
    ).toEqual({ type: "success", value: "0" });
  });

  test("keeps an unsuccessful decode intact", () => {
    expect(tuscon.flatMap(tuscon.string, () => tuscon.succeed("default"))(0)).toEqual({
      type: "error",
      value: "expected a string, received: 0",
    });
  });
});
