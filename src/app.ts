import * as t from "io-ts";
import { chain } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/function";
import { JsonFromString, Json } from "io-ts-types";

export const compose =
  <I2, A extends I2, B>(Codec2: t.Type<B, A, I2>) =>
  <O1, I1, Name extends string = string>(
    Codec1: t.Type<A, O1, I1>,
    name?: Name
  ): t.Type<B, O1, I1> => {
    return new t.Type<B, O1, I1>(
      name || `${Codec1.name} -> ${Codec2.name}`,
      (u): u is B => Codec2.is(u),
      (a, c) =>
        pipe(
          a,
          (a) => Codec1.validate(a, c),
          chain((b) => Codec2.validate(b, c))
        ),
      (b) =>
        pipe(
          b,
          (b) => Codec2.encode(b),
          (a) => Codec1.encode(a)
        )
    );
  };
