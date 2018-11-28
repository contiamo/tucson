import * as tucson from "../index";

describe("map", () => {
  test("maps over a successful decode", () => {
    expect(tucson.map(tucson.string, Number)("0")).toEqual({ type: "success", value: 0 });
  });

  test("keeps an unsuccessful decode intact", () => {
    expect(tucson.map(tucson.string, Number)(0)).toEqual({ type: "error", value: "expected a string, received: 0" });
  });
});

describe("flatMap", () => {
  test("flatmaps over a successful decode", () => {
    expect(
      tucson.flatMap(tucson.string, str => {
        if (str.length < 10) {
          return tucson.succeed(str);
        }
        return tucson.fail("too long");
      })("0"),
    ).toEqual({ type: "success", value: "0" });
  });

  test("keeps an unsuccessful decode intact", () => {
    expect(tucson.flatMap(tucson.string, () => tucson.succeed("default"))(0)).toEqual({
      type: "error",
      value: "expected a string, received: 0",
    });
  });
});
