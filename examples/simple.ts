import * as tuscon from "../";

export interface Person {
  name: string;
  age: number;
}

tuscon.object({
  name: tuscon.string,
  age: tuscon.number,
})({ name: "Paul", age: "thirty-five" }); // { type: "error", value: ".age -> should be a number" }
