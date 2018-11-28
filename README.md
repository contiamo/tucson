# tuscon

Type-safe runtime schema validator that won't leave you in the desert.

## Getting started

Simply install as `npm install tuscon` and start validating like so:

```ts
import * as tuscon from "tuscon";

interface Person {
  name: string;
  age: number;
}

tuscon.object({
  name: tuscon.string,
  age: tuscon.number,
})({ name: "Paul", age: "thirty-five" }); // logs { type: "error", value: "expected field 'age' to decode correctly, received: \"thirty-five\"" }
```

Anything you create/combine with `tuscon` will become a function that you can call on your data, returning a result object indicating success or a specific error you can reconcile with your server.

## Motivation

We wanted a clean, simple, non-obtrusive solution that supports complicated data structures while not compromising type-safety and ease of use.

The API is inspired by [Elm's json decoders](https://package.elm-lang.org/packages/elm/json/latest/Json-Decode), making sure it suits TypeScript well and giving it a [lodash](https://lodash.com/docs/4.17.11)-style twist. Hello safe and familiar.

## API guide

### Primitive decoders

Primitive decoders decode primitive types that translate into primitive types in TypeScript. `tuscon.string(2)` returns an error because it was given a number, whereas `tuscon.boolean(true)` and `tuscon.number(5)` will come back with a success. You get the deal.

### Combining decoders

Non-primitive types are built up from primitive ones using helpers like `tuscon.object` in the example above. The combine methods are as follows:

#### optional

#### object

#### dictionary

#### array

### Transforming decoders

Any realistic application will run into the following needs:

- transforming the result of a successful decode (date string to date object for instance)
- decoding algebraic data types
- performing fine-grained validation such as integers only or last names present

This is where `tuscon` gets very unopinionated and mathemtical, allowing you to do all this in pretty much two methods:

#### map

`map` simply transforms a successful decode result, while obviously leaving unsuccessful ones alone with their original error message.

```ts
tuscon.map(tuscon.string, Number)("2"); // { type: "success", value: 2 }
```

Any transformation can be made at this point, maintaining type-safety through function signatures.

#### flatMap

The limitation of `map` is that if the original decoder succeeds, the mapped one succeeds also. But what if I want to reject a value like `358.37` coming in for a field like conference attendees?

When using `flatMap`, the mapping function doesn't return a value, but instead a decoder, which is 'flattened' under the hood to get a final value:

```ts
const attendeesDecoder = tuscon.flatMap(tuscon.number, count => {
  if (count === Math.floor(count)) {
    return tuscon.succeed(count);
  }
  return tuscon.fail("expected an integer");
});
```

`succeed` and `fail` are decoders that immediately resolve in a constant or success value, similar to `Promise.resolve` or `Promise.reject`. They seem trivial, but come in super handy in situations like this.

### Custom decoders

Why did we call them decoders? They're basically a function that takes an `any` and returns `{ type: "success", value: T } | { type: "error", value: "should be pleasing to the eye" }`, so you can quickly come up with domain-specific decoders and not be tied up with an opinionated library. `tuscon` takes care of composition so you can easily set up the building blocks that are right for you.

With custom decoders, however, you are responsible that they don't thrown runtime errors, a guarantee that `tuscon`'s primitives will keep for you.

## Alternatives

Have a look at the following projects that can be suitable alternatives to `tuscon` depending on your needs:

- `yup`
- `joi`
- `ajv`
- `elm/json`

## Contributing

Feel free to just open an issue and start a discussion. This will be more formal when the library gets more exposure.

---

`tuscon` is born and raised at `Contiamo` in Berlin. Our Arizona ties are scarce
