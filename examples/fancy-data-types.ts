import * as tucson from "../";

export type Department = "Sales" | "Engineering";

const departmentDecoder: tucson.Decoder<Department> = (() => {
  const normalDepartmentDecoder: tucson.Decoder<Department> = tucson.oneOf(
    tucson.literal("Sales"),
    tucson.literal("Engineering"),
  );

  const legacyDepartmentDecoder: tucson.Decoder<Department> = tucson.flatMap(tucson.string, stringValue =>
    stringValue.startsWith("MERCHANT_GUILD#")
      ? tucson.succeed<Department>("Sales")
      : stringValue.startsWith("SERFS_OF")
      ? tucson.succeed<Department>("Engineering")
      : tucson.fail("not a valid job"),
  );

  return tucson.oneOf(normalDepartmentDecoder, legacyDepartmentDecoder);
})();

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

const personDecoder: tucson.Decoder<Person> = tucson.ensure(
  tucson.object({
    name: tucson.string,
    age: tucson.oneOf([tucson.number, tucson.map(tucson.string, Number)]),
    department: departmentDecoder,
    contact: tucson.object({
      email: tucson.string,
      phone: tucson.string,
    }),
    tree: treeDecoder,
  }),
)([p => p.name === "Peter" || p.contact.email === "", "weird condition is not met"]);

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

personDecoder({
  name: "Ievgen",
  age: 9,
  department: "SERFS_OF_MERCHANT#3",
  contact: { email: "", phone: "" },
  tree: {
    name: "",
    children: [],
  },
});
