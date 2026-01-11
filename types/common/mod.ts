import { Ser } from "@mcbe/serialize";
import type { AnyConstructor } from "@std/assert";

export * from "./component/mod.ts";

export const TOOL_NAME = "MCBE-Types";

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

/**
 * Takes the properties of `T` and returns a matching object based on `Original`
 * and `Optional`.
 */
export type InputProps<
  T,
  Original extends keyof T,
  Optional extends Exclude<keyof T, Original> = never,
> =
  & Pick<T, Original>
  & Partial<Pick<T, Optional>>;

/** Similar to {@link InputProps} but derives the properties from `T`'s constructor `props` parameter. */
export type DerivedInputProps<
  T extends AnyConstructor,
> = ConstructorParameters<T>[0];

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

  static from(length: number): Range {
    return new Range(0, length - 1);
  }

  static customTuple(range: Range): [number, number] {
    return [range.min, range.max];
  }

  static customObject(range: Range): { min: number; max: number } {
    return { min: range.min, max: range.max };
  }

  static customValuesObject(
    range: Range,
  ): { values: { min: number; max: number } } {
    return { values: { min: range.min, max: range.max } };
  }
}

export type InventoryCategory =
  | "nature"
  | "equipment"
  | "items"
  | "construction"
  | "none";

export interface InstanceResolvable<T> {
  resolveInstances(): T[];
}
