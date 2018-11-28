import * as tuscon from "../";

export type Department = "Sales" | "Engineering";

const departmentDecoder: tuscon.Decoder<Department> = tuscon.flatMap(tuscon.string, stringValue => {
  switch (stringValue) {
    case "Sales":
      return tuscon.succeed("Sales" as Department);
    case "Engineering":
      return tuscon.succeed("Engineering" as Department);
    default:
      return tuscon.fail("not a valid job");
  }
});

export interface Tree {
  name: string;
  children: Tree[];
}

const treeDecoder: tuscon.Decoder<Tree> = tuscon.object({
  name: tuscon.string,
  children: tuscon.array(tuscon.lazy(() => treeDecoder)),
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

const personDecoder: tuscon.Decoder<Person> = tuscon.object({
  name: tuscon.string,
  age: tuscon.oneOf([tuscon.number, tuscon.map(tuscon.string, Number)]),
  department: departmentDecoder,
  contact: tuscon.object({
    email: tuscon.string,
    phone: tuscon.string,
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
