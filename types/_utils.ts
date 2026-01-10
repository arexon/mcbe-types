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

export function resolveInstances(values: unknown[]): unknown[] {
  for (let i = 0; i < values.length; i++) {
    const feature = values[i];
    if (
      typeof feature === "object" && feature !== null && "identifier" in feature
    ) {
      values[i] = feature.identifier;
    }
  }
  return values;
}
