import * as t from "io-ts";
import { pipe } from "fp-ts/function";
import { Json, JsonFromString } from "io-ts-types";
import { compose } from "./app";
import { isLeft } from "fp-ts/lib/Either";

it("example test", () => {
  const personFromJson = pipe(
    t.string,
    compose(JsonFromString),
    compose<unknown, Json, { name: string; age: number }>(
      t.strict({
        name: t.string,
        age: t.number,
      })
    )
  );

  const person1E = personFromJson.decode('{"name":"Tony","age":31}');
  expect(person1E).toEqual({ _tag: "Right", right: { name: "Tony", age: 31 } });

  const person2E = personFromJson.decode('{"name":"Tony"}');
  console.log(person2E);
  expect(isLeft(person2E)).toEqual(true);
});
