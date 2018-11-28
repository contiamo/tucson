import * as tucson from "../";

export interface Person {
  name: string;
  age: number;
}

tucson.object({
  name: tucson.string,
  age: tucson.number,
})({ name: "Paul", age: "thirty-five" }); // { type: "error", value: ".age -> should be a number" }
