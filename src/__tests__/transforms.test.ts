import * as tucson from "../index";
import { error, success } from "../types";

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

describe("ensure", () => {
  test("object", () => {
    const personDecoder = tucson.ensure(
      tucson.object({ name: tucson.string, age: tucson.number }),
      [p => p.name.startsWith("Ievgen"), "name is too far from perfect"],
      [p => p.age > p.name.length, "unexpected age"],
    );

    expect(personDecoder({ name: "Foo", age: 32 })).toEqual(error("name is too far from perfect"));
    expect(personDecoder({ name: "IevgenFoo", age: 5 })).toEqual(error("unexpected age"));
    expect(personDecoder({ name: "IevgenFoo", age: 33 })).toEqual(success({ name: "IevgenFoo", age: 33 }));
  });

  test("inline", () => {
    const personDecoder = tucson.object({
      name: tucson.ensure(tucson.string, [s => s.startsWith("Ievgen"), "name is too far from perfect"]),
      age: tucson.ensure(tucson.number, [n => n >= 0, "negative age"]),
    });

    expect(personDecoder({ name: "Foo", age: 32 })).toEqual(
      error("error decoding field 'name': name is too far from perfect"),
    );
    expect(personDecoder({ name: "IevgenFoo", age: -15 })).toEqual(error("error decoding field 'age': negative age"));
    expect(personDecoder({ name: "IevgenFoo", age: 33 })).toEqual(success({ name: "IevgenFoo", age: 33 }));
  });
});
