import { Ser } from "@mcbe/serialize";

export * from "./component/mod.ts";

/**
 * Takes the properties of `T` and returns a matching object based on
 * `OriginalProps` and `OptionalProps`.
 */
export type InputProps<
  T,
  Original extends keyof T,
  Optional extends Exclude<keyof T, Original> = never,
> =
  & Pick<T, Original>
  & Partial<Pick<T, Optional>>;

/** Similar to {@link InputProps} but derives the properties from `T`'s constructor `props` parameter. */
// deno-lint-ignore no-explicit-any
export type DerivedInputProps<T extends new (...args: any) => any> =
  ConstructorParameters<T>[0];

@Ser()
export class Range {
  @Ser()
  min: number;

  @Ser()
  max: number;

  constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  static customTuple(range: Range): [number, number] {
    return [range.min, range.max];
  }

  static customObject(range: Range): { min: number; max: number } {
    return { min: range.min, max: range.max };
  }

  static customValueObject(
    range: Range,
  ): { value: { min: number; max: number } } {
    return { value: { min: range.min, max: range.max } };
  }
}
