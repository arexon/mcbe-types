/**
 * Serialization and deserialization library with superpowers. Inspired by [Serde](https://serde.rs).
 *
 * @module
 */

import { type AnyConstructor, equal } from "@std/assert";
import { FromJsonGenerator, ToJsonGenerator } from "./generators.ts";
import { FIELDS_METADATA, FieldsMetadata } from "./metadata.ts";
import type { EdresType } from "./types.ts";

export { type Infer, t } from "./types.ts";

/** Parsing result from calling {@link deserialize()}. */
export type EdresResult<T extends AnyConstructor> = {
  isOk: true;
  value: InstanceType<T>;
} | {
  isOk: false;
  errors: EdresError[];
};

/** Parsing error from calling {@link deserialize()}. */
export interface EdresError {
  /** Nested path leading to the exact location of where the error occured. */
  path: string;
  /** The cause of the error. */
  message: string;
}

/**
 * Deserializes the input and instantiates `T`.
 *
 * `T` must either be decorated with {@link Edres()} or manually implement `fromJSON()`.
 *
 * @typeParam T The type to deserialize into
 * @returns The result containing either an instance of `T` or errors
 */
export function deserialize<T extends AnyConstructor>(
  input: string,
  ctor: T,
): EdresResult<T> {
  if (!("fromJSON" in ctor && typeof ctor.fromJSON === "function")) {
    throw new TypeError("Constructor has no `fromJSON()` method");
  }
  const data = JSON.parse(input);
  return ctor.fromJSON(data, ctor);
}

/** Options to configure how a field should be serialized. */
export interface FieldOptions<FieldValue> {
  /**
   * A callback that returns the default value for this field.
   *
   * During serialization, the default is compared against the field's current
   * value. If it matches, the field is omitted.
   * Note that the comparison is deep for non-primitives.
   */
  default?: () => FieldValue;
  /**
   * Defines a callback that returns a custom value to override the serialized
   * field and a strategy for how the custom value should be serialized.
   *
   * Strategies:
   * - `normal`: directly place the value as is
   * - `merge`: merge the value (object, array) with the object properties
   *
   * When {@link FieldOptions.default} is set, it will compare against the
   * custom value.
   */
  custom?: [(value: FieldValue) => unknown, "normal" | "merge"];
  /**
   * A custom name for the serialized field.
   *
   * When {@link FieldOptions.custom} is set to `merge`, merged fields that
   * match the renamed key will overwrite it.
   */
  rename?: string;
}

/** Options to configure how a class should be serialized. */
export interface ClassOptions<FieldName> {
  /**
   * A name of the field (instance field or getter) to use as the serialized
   * value for this class.
   *
   * This will only apply if every other field is undefined at the time.
   */
  transparent?: FieldName;
}

/**
 * A decorator to apply on classes or instance fields.
 *
 * It implements the following:
 * - `toJSON()` on the class prototype
 * - `fromJSON()` on the constructor
 */
export function Edres<
  Ctx extends ClassDecoratorContext | ClassFieldDecoratorContext,
>(
  ...args: Ctx extends { kind: "class" } ? [
      opts?: ClassOptions<
        Ctx extends ClassDecoratorContext<infer V> ? keyof {
            [
              K in keyof InstanceType<V> as InstanceType<V>[K] extends
                (...args: unknown[]) => unknown ? never : K
            ]: K;
          }
          : never
      >,
    ]
    : [
      type: EdresType,
      opts?: FieldOptions<
        Ctx extends ClassFieldDecoratorContext<unknown, infer V> ? V : never
      >,
    ]
): (
  target: Ctx extends { kind: "class" } ? AnyConstructor : undefined,
  ctx: Ctx,
) => void {
  return (target, ctx) => {
    if (ctx.kind === "field") {
      fieldImpl(ctx, args[0] as EdresType, args[1] as FieldOptions<unknown>);
    } else if (ctx.kind === "class") {
      classImpl(ctx, target!, args[0] as ClassOptions<string>);
    }
  };
}

interface Metadata {
  readonly metadata: {
    [FIELDS_METADATA]?: FieldsMetadata;
  };
}

function fieldImpl(
  ctx: ClassFieldDecoratorContext & Metadata,
  type: EdresType,
  opts?: FieldOptions<unknown>,
): void {
  ctx.metadata[FIELDS_METADATA] ??= new FieldsMetadata();
  if (typeof ctx.name !== "symbol") {
    ctx.metadata[FIELDS_METADATA].set(ctx.name, type, opts ?? {});
  }
}

function classImpl(
  ctx: ClassDecoratorContext & Metadata,
  ctor: AnyConstructor,
  classOpts: ClassOptions<string>,
): void {
  ctx.metadata[FIELDS_METADATA] ??= new FieldsMetadata();
  const fields = ctx.metadata[FIELDS_METADATA];
  const transparent = classOpts?.transparent;

  const toJsonFn = new ToJsonGenerator(fields, transparent).generate();
  Object.defineProperty(ctor.prototype, "toJSON", {
    value() {
      return toJsonFn.call(this, FIELDS_METADATA, equal);
    },
    configurable: true,
    writable: true,
  });

  const fromJsonFn = new FromJsonGenerator(fields, ctor).generate();
  Object.defineProperty(ctor, "fromJSON", {
    value(input: unknown, ctor: AnyConstructor, parentPath?: string) {
      return fromJsonFn(input, ctor, FIELDS_METADATA, parentPath);
    },
    configurable: true,
    writable: true,
  });
}
