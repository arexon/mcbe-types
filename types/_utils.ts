import type { AnyConstructor } from "@std/assert";

export function maybeConstruct<T extends AnyConstructor>(
  constructor: T,
  input: InstanceType<T> | undefined,
): InstanceType<T> | undefined {
  // deno-lint-ignore no-explicit-any
  return (input as any) instanceof constructor
    ? input
    : input === undefined
    ? input
    : new constructor(input);
}

export function maybeConstructArray<T extends AnyConstructor>(
  constructor: T,
  input: InstanceType<T>[],
): InstanceType<T>[] {
  for (let i = 0; i < input.length; i++) {
    input[i] = maybeConstruct(constructor, input[i])!;
  }
  return input;
}
