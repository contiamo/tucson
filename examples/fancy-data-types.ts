import * as tucson from "../";

export type Department = "Sales" | "Engineering";

const departmentDecoder: tucson.Decoder<Department> = tucson.flatMap(tucson.string, stringValue => {
  switch (stringValue) {
    case "Sales":
      return tucson.succeed("Sales" as Department);
    case "Engineering":
      return tucson.succeed("Engineering" as Department);
    default:
      return tucson.fail("not a valid job");
  }
});

export interface Tree {
  name: string;
  children: Tree[];
}

const treeDecoder: tucson.Decoder<Tree> = tucson.object({
  name: tucson.string,
  children: tucson.array(tucson.lazy(() => treeDecoder)),
});

export interface Person {
  name: string;
  age: number;
  department: Department;
  contact: {
    email: string;
    phone: string;
  };
}

const personDecoder: tucson.Decoder<Person> = tucson.object({
  name: tucson.string,
  age: tucson.oneOf([tucson.number, tucson.map(tucson.string, Number)]),
  department: departmentDecoder,
  contact: tucson.object({
    email: tucson.string,
    phone: tucson.string,
  }),
  tree: treeDecoder,
});

personDecoder({
  name: "Peter",
  age: 14,
  department: "Sales",
  contact: { email: "", phone: "" },
  tree: {
    name: "",
    children: [],
  },
});
