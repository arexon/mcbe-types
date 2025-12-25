/**
 * Serialization library inspired by [Serde](https://serde.rs) from the Rust ecosystem.
 *
 * @module
 */

import { type AnyConstructor, equal } from "@std/assert";
import { toSnakeCase } from "@std/text";

/** Context metadata associated with a class decorator. Used by {@link Serialize} */
export interface SerializeMetadata<FieldValue> {
  /** The actual metadata in {@link ClassDecoratorContext} */
  readonly metadata: {
    /** Maps fields to serialization options. */
    fields?: Record<string, FieldOptions<FieldValue> | undefined>;
  };
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
 * It implements a [`toJSON()`][toJSON] method on the class.
 *
 * [toJSON]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior
 */
export function Serialize<
  Ctx extends
    & (ClassDecoratorContext | ClassFieldDecoratorContext)
    & SerializeMetadata<unknown>,
>(
  opts?: Ctx extends { kind: "class" } ? ClassOptions<
      Ctx extends ClassDecoratorContext<infer V> ? keyof {
          [
            K in keyof InstanceType<V> as InstanceType<V>[K] extends
              (...args: unknown[]) => unknown ? never : K
          ]: K;
        }
        : never
    >
    : FieldOptions<
      Ctx extends ClassFieldDecoratorContext<unknown, infer V> ? V : never
    >,
): (
  target: Ctx extends { kind: "class" } ? AnyConstructor : undefined,
  ctx: Ctx,
) => void {
  return (target, ctx) => {
    if (ctx.kind === "field") {
      fieldImpl(ctx, (opts ?? {}) as FieldOptions<unknown>);
    } else if (ctx.kind === "class") {
      classImpl(ctx, target!.prototype, (opts ?? {}) as ClassOptions<unknown>);
    }
  };
}

function fieldImpl(
  ctx: ClassFieldDecoratorContext & SerializeMetadata<unknown>,
  opts: FieldOptions<unknown>,
): void {
  ctx.metadata.fields ??= {};
  if (typeof ctx.name !== "symbol") {
    const fields = ctx.metadata.fields;
    fields[ctx.name] = { ...fields[ctx.name], ...opts };
  }
}

function classImpl(
  ctx: ClassDecoratorContext & SerializeMetadata<unknown>,
  proto: unknown,
  classOpts: ClassOptions<unknown>,
): void {
  const transparent = classOpts?.transparent;
  if (transparent !== undefined && typeof transparent !== "string") {
    throw new Error(
      `Transparent field "${String(transparent)}" must be a string`,
    );
  }

  let body = "";
  if (ctx.metadata.fields !== undefined) {
    const fieldsLength = Object.keys(ctx.metadata.fields).length;

    let isTransparentCheck = "";

    body += "{";
    for (
      const [index, [fieldName, fieldOpts]] of Object.entries(
        ctx.metadata.fields,
      ).entries()
    ) {
      const isFieldTransparentCheck = `"${fieldName}" === "${
        transparent ?? ""
      }"`;

      let key: string;
      if (fieldOpts?.rename !== undefined) key = fieldOpts.rename;
      else if (!fieldName.includes(":")) key = toSnakeCase(fieldName);
      else key = fieldName;

      let value = `this["${fieldName}"]`;

      if (fieldOpts?.custom !== undefined) {
        value = getMetadata(fieldName, `custom[0](${value})`);
      }

      if (fieldOpts?.default !== undefined) {
        const isDefaultCheck = `equal(${
          JSON.stringify(fieldOpts.default())
        }, ${value})`;

        if (transparent !== undefined) {
          isTransparentCheck +=
            `(${isFieldTransparentCheck} || ${isDefaultCheck} || ${value} === undefined)`;
        }

        value = `${isDefaultCheck} ? undefined : ${value}`;
      } else if (transparent !== undefined) {
        isTransparentCheck +=
          `(${isFieldTransparentCheck} || ${value} === undefined)`;
      }

      if (transparent !== undefined && index < fieldsLength - 1) {
        isTransparentCheck += " && ";
      }

      let keyValuePair = "";
      if (fieldOpts?.custom?.[1] === "merge") {
        keyValuePair = `...(${value}),`;
      } else {
        keyValuePair = `"${key}": ${value},`;
      }

      body += keyValuePair;
    }
    body += "}";

    const transparentField = Object.entries(ctx.metadata.fields)
      .find((field) => field[0] === transparent);
    if (transparentField !== undefined && isTransparentCheck !== "") {
      const [transparentFieldName, transparentFieldOpts] = transparentField;
      let value = `this["${transparentFieldName}"]`;
      // This is necessary because the method is not called on directly
      // returned values, but rather on object properties.
      value = `(${value}?.toJSON?.() ?? ${value})`;

      if (transparentFieldOpts?.custom !== undefined) {
        value = getMetadata(transparentFieldName, `custom[0](${value})`);
      }

      body = `(${isTransparentCheck}) ? ${value} : ${body}`;
    }
  } else {
    if (classOpts?.transparent !== undefined) {
      body = `this["${String(classOpts.transparent)}"]`;
    } else {
      body = "{}";
    }
  }
  body = "return " + body;

  const fn = new Function("equal", body);
  Object.defineProperty(proto, "toJSON", {
    value() {
      return fn.call(this, equal);
    },
    configurable: true,
    writable: true,
  });
}

function getMetadata(fieldName: string, data: string): string {
  return `this.constructor[Symbol.metadata]?.fields?.["${fieldName}"]?.${data}`;
}
