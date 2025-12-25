/**
 * Simple validation library based on decorators.
 *
 * @module
 */

import type { AnyConstructor } from "@std/assert";

/** Context metadata associated with a class decorator. Used by {@link Validate} */
export interface ValidateMetadata<Field> {
  /** The actual metadata in {@link ClassDecoratorContext} */
  readonly metadata: {
    /** Maps fields to validation info. */
    fields?: Record<string, { assertion?: AssertionCallback<Field> | null }>;
  };
}

/**
 * An assertion callback.
 *
 * @typeParam T The value type to assert
 */
export type AssertionCallback<T> = (value: T) => AssertionResult;

/**
 * The result of an {@link AssertionCallback}.
 *
 * `undefined` indicates the assertion succeeded.
 */
export type AssertionResult = {
  /** Why the assertion failed. */
  reason: string;
} | undefined;

/** Complete assertion error. Superset of {@link AssertionResult}. */
export type AssertionError = {
  /** Path to the field in question. */
  path: string;
} & AssertionResult;

/**
 * A decorator to apply on classes or instance fields.
 *
 * On classes, it implements a `validate()` method (required).
 *
 * On instance fields, it optionally accepts an {@link AssertionCallback}.
 * Providing no argument signifies that the field will be transparent and
 * validation will be delegated to its value.
 */
export function Validate<
  Ctx extends
    & (
      | ClassDecoratorContext
      | ClassFieldDecoratorContext
    )
    & ValidateMetadata<unknown>,
>(
  ...args: Ctx extends { kind: "class" } ? []
    : [
      assertion?: AssertionCallback<
        Ctx extends ClassFieldDecoratorContext<unknown, infer V> ? V : never
      >,
    ]
): (
  target: Ctx extends { kind: "class" } ? AnyConstructor : undefined,
  ctx: Ctx,
) => void {
  return (target, ctx) => {
    if (ctx.kind === "field") fieldImpl(ctx, args[0] ?? null);
    else if (ctx.kind === "class") {
      classImpl(ctx, target!.prototype, target!.name);
    }
  };
}

/**
 * Validates an instance of a class decorated with {@link Validate} by calling
 * the "hidden" `.validate()` method.
 */
export function validate<T extends object>(target: T): AssertionError[] {
  // @ts-ignore - We safely acccess the method and attempt to call it.
  return target?.validate?.() ?? [];
}

function fieldImpl(
  ctx: ClassFieldDecoratorContext & ValidateMetadata<unknown>,
  assertion: AssertionCallback<unknown> | null,
): void {
  ctx.metadata.fields ??= {};
  if (typeof ctx.name !== "symbol") {
    const fields = ctx.metadata.fields;
    fields[ctx.name] = { ...fields[ctx.name], assertion };
  }
}

function classImpl(
  ctx: ClassDecoratorContext & ValidateMetadata<unknown>,
  proto: unknown,
  name: string,
): void {
  let body = "const errors = [];";
  for (
    const [index, [fieldName, { assertion }]] of Object.entries(
      ctx.metadata.fields ?? {},
    ).entries()
  ) {
    // `fields` is shared with another decorator.
    // The field metadata could already exist, but `assertion` might not.
    if (assertion === undefined) continue;

    const res = `res${index}`;
    const path = `path${index}`;
    const metadata = getMetadata(fieldName, "assertion");
    body +=
      `const ${path} = (parentName !== undefined ? parentName + "::" : "") + "${name}" + ".${fieldName}";`;

    // `null` is used here when the decorator is defined but has explicity not
    // set an assertion, indicating that validation should be transparent.
    if (assertion === null) {
      body += `errors.push(...this["${fieldName}"]?.validate?.(${path}));`;
    } else {
      body += `const ${res} = ${metadata}?.(this["${fieldName}"]);`;
      body +=
        `if (${res} !== undefined) errors.push({ path: ${path}, ...${res} });`;
    }
  }
  body += "return errors;";

  const fn = new Function("parentName", body);
  Object.defineProperty(proto, "validate", {
    value(parentName?: string) {
      return fn.call(this, parentName);
    },
    configurable: true,
    writable: true,
  });
}

function getMetadata(fieldName: string, data: string): string {
  return `this.constructor[Symbol.metadata]?.fields?.["${fieldName}"]?.${data}`;
}
