# tucson

Type-safe runtime schema validator that won't leave you in the desert.

## Getting started

Simply install as `npm install tucson` and start validating like so:

```ts
import * as tucson from "tucson-decode";

tucson.object({
  name: tucson.string,
  age: tucson.number,
})({ name: "Paul", age: "thirty-five" }); // logs { type: "error", value: { path: [ "age" ], error: "expected number", received: "thirty-five" } }
```

Anything you create/combine with `tucson` will become a function that you can call on your data, returning a result object indicating success or a specific error you can reconcile with your server.

## Motivation

We wanted a clean, simple, non-obtrusive solution that supports complicated data structures while not compromising type-safety and ease of use.

The API is inspired by [Elm's json decoders](https://package.elm-lang.org/packages/elm/json/latest/Json-Decode), making sure it suits TypeScript well and giving it a [lodash](https://lodash.com/docs/4.17.11)-style twist. Hello safe and familiar.

## API guide

### Primitive decoders

Primitive decoders decode primitive types that translate into primitive types in TypeScript. `tucson.string(2)` returns an error because it was given a number, whereas `tucson.boolean(true)` and `tucson.number(5)` will come back with a success. You get the deal.

### Combining decoders

Non-primitive types are built up from primitive ones using helpers like `tucson.object` in the example above. The combine methods are as follows:

#### optional

Any decoder can be made optional so it succeeds with `undefined` if the value isn't there.

#### object

A decoder for a statically defined object structure can be simply built up from an object of the same shape, just with equivalent decoders as field values:

```ts
interface Person {
  name: string;
  age: number;
}

const personDecoder: tucson.Decoder<Person> = tucson.object({
  name: tucson.string,
  age: tucson.number,
});
```

This is completely type-safe, courtesy of the TypeScript compiler.

#### dictionary

Dictionaries are the dynamic cousins of objects so they can have any number of keys with the restriction that values are of the same type. They correspond most closely to maps in JavaScript and the `Record` type in TypeScript. We are refraining from those names to avoid confusion on minor nuances.

You can define a dictionary decoder by simply passing it the decoder of the value:

```ts
tucson.dictionary(tucson.string)({ one: "two", three: "four" }); // success
```

#### array

By calling `tucson.array(someDecoder as tucson.Decoder<Some>)` an array of a `Some`'s is decoded.

### Transforming decoders

Any realistic application will run into the following needs:

- transforming the result of a successful decode (date string to date object for instance)
- decoding algebraic data types
- performing fine-grained validation such as integers only or last names present

This is where `tucson` gets very unopinionated and mathemtical, allowing you to do all this in pretty much two methods:

#### map

`map` simply transforms a successful decode result, while obviously leaving unsuccessful ones alone with their original error message.

```ts
tucson.map(tucson.string, Number)("2"); // { type: "success", value: 2 }
```

Any transformation can be made at this point, maintaining type-safety through function signatures.

#### flatMap

The limitation of `map` is that if the original decoder succeeds, the mapped one succeeds also. But what if I want to reject a value like `358.37` coming in for a field like conference attendees?

When using `flatMap`, the mapping function doesn't return a value, but instead a decoder, which is 'flattened' under the hood to get a final value:

```ts
const attendeesDecoder = tucson.flatMap(tucson.number, count => {
  if (count === Math.floor(count)) {
    return tucson.succeed(count);
  }
  return tucson.fail("expected an integer");
});
```

`succeed` and `fail` are decoders that immediately resolve in a constant or success value, similar to `Promise.resolve` or `Promise.reject`. They seem trivial, but come in super handy in situations like this.

### Custom decoders

Why did we call them decoders? They're basically a function that takes an `any` and returns `{ type: "success", value: T } | { type: "error", value: "should be pleasing to the eye" }`, so you can quickly come up with domain-specific decoders and not be tied up with an opinionated library. `tucson` takes care of composition so you can easily set up the building blocks that are right for you.

With custom decoders, however, you are responsible that they don't thrown runtime errors, a guarantee that `tucson`'s primitives will keep for you.

### Errors

When decoders fail, they provide to-the-point error messages that help pin down errors easily. They can be referenced instantly to open up a discussion around frontend-backend contracts and find bugs in both places.

A typical error message looks like this:

```
{
  type: "error",
  value: [
    // There can be multiple error messages
    {
      path: [ "address", "street" ],
      error: "expected string",
      received: 2
    }
  ]
}
```

## Alternatives

`tucson` is inspired by and an alternative to the following projects:

- [elm/json](https://package.elm-lang.org/packages/elm/json/latest/Json-Decode)
- [json-type-validation](https://github.com/mojotech/json-type-validation)
- [yup](https://github.com/jquense/yup)
- [joi](https://github.com/hapijs/joi)
- [ajv](https://github.com/epoberezkin/ajv)

## Contributing

Feel free to just open an issue and start a discussion. This will be more formal when the library gets more exposure.

---

`tucson` is born and raised at `Contiamo` in Berlin. Our Arizona ties are scarce
