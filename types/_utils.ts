import type { AnyConstructor } from "@std/assert";

export function maybeConstruct<T>(
  input: T,
  ...constructors: AnyConstructor[]
): T {
  if (input === undefined) {
    return input;
  }

  for (const ctor of constructors) {
    if (input instanceof ctor) {
      return input;
    }

    try {
      return new ctor(input);
    } catch {
      continue;
    }
  }

  return input;
}

export function maybeConstructArray<T>(
  input: T[],
  ...constructors: AnyConstructor[]
): T[] {
  for (let i = 0; i < input.length; i++) {
    input[i] = maybeConstruct(input[i], ...constructors)!;
  }
  return input;
}
