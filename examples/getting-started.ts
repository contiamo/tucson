import * as tucson from "../";

const personDecoder = tucson.object({
  name: tucson.string,
  age: tucson.number,
});

personDecoder({ name: "Paul", age: "35" }); // { type: "error", value: ".age -> should be a number" }

personDecoder({ name: "Paul", age: 35 }); // { type: "success", value: { name: "Paul", age: 35 } }
