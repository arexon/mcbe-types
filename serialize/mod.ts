/**
 * Simple serialization library powered by decorators. Inspired by [Serde](https://serde.rs).
 *
 * @module
 */

import { type AnyConstructor, equal } from "@std/assert";
import { toSnakeCase } from "@std/text";

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
  /**
   * A path within the serialized object to place this field, delimited by `/`.
   *
   * Each part of the path is created as an object if it does not already exist.
   */
  path?: string;
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
 * It implements `toJSON()` on the class prototype
 */
export function Ser<
  Ctx extends ClassDecoratorContext | ClassFieldDecoratorContext,
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
      fieldImpl(ctx, opts as FieldOptions<unknown>);
    } else if (ctx.kind === "class") {
      classImpl(ctx, target!, opts as ClassOptions<string>);
    }
  };
}

interface ContextMetadata {
  readonly metadata: {
    [Metadata.symbol]?: Metadata;
  };
}

const SPECIAL_CHARACTERS_REGEXP = /[$&+,:;=?@#|'<>.^*()%!-]/;

interface FieldMetadata {
  index: number;
  name: string;
  default?: () => unknown;
  custom?: { fn: (value: unknown) => unknown; strategy: "normal" | "merge" };
  rename?: string;
  path?: string;
}

class Metadata {
  static readonly symbol = Symbol();
  static readonly symbolName = "metadataSymbol";

  length = 0;
  transparent: string | undefined;
  fields: Record<string, FieldMetadata> = {};

  setField(name: string, options: FieldOptions<unknown>): void {
    this.fields[name] = {
      index: this.length,
      name,
      custom: options.custom !== undefined
        ? { fn: options.custom[0], strategy: options.custom[1] }
        : undefined,
      default: options.default,
      rename: options.rename,
      path: options.path,
    };
    this.length++;
  }

  getField(name: string): FieldMetadata | undefined {
    return this.fields[name];
  }

  getKey(name: string): string {
    const field = this.fields[name];
    if (field.rename !== undefined) {
      return field.rename;
    } else if (!SPECIAL_CHARACTERS_REGEXP.test(field.name)) {
      return toSnakeCase(field.name);
    } else {
      return field.name;
    }
  }
}

function fieldImpl(
  ctx: ClassFieldDecoratorContext & ContextMetadata,
  opts?: FieldOptions<unknown>,
): void {
  ctx.metadata[Metadata.symbol] ??= new Metadata();
  if (typeof ctx.name !== "symbol") {
    ctx.metadata[Metadata.symbol]!.setField(ctx.name, opts ?? {});
  }
}

function classImpl(
  ctx: ClassDecoratorContext & ContextMetadata,
  ctor: AnyConstructor,
  classOpts: ClassOptions<string>,
): void {
  ctx.metadata[Metadata.symbol] ??= new Metadata();
  const metadata = ctx.metadata[Metadata.symbol]!;
  metadata.transparent = classOpts?.transparent;

  const toJsonFn = generateToJson(metadata);

  Object.defineProperty(ctor.prototype, "toJSON", {
    value() {
      return toJsonFn.call(this, Metadata.symbol, equal);
    },
    configurable: true,
    writable: true,
  });
}

type ObjectProps = { [key: string]: string | ObjectProps };

// deno-lint-ignore ban-types
function generateToJson(metadata: Metadata): Function {
  let body = "";
  const canClassBeTransparent: string[] = [];
  const objectProps: ObjectProps = {};
  const customValues: [string, string][] = [];

  if (metadata.length > 0) {
    for (const field of Object.values(metadata.fields)) {
      const key = field.custom?.strategy === "merge"
        ? "..."
        : metadata.getKey(field.name);
      let value = `this["${field.name}"]`;

      const canFieldAllowTransprency = [];
      if (field.name !== metadata.transparent) {
        canFieldAllowTransprency.push(`${value} === undefined`);
      }

      if (field.custom !== undefined) {
        const customValue = `customValue${field.index}`;
        const fieldsMetadata = "fieldsMetadata";

        if (customValues.length === 0) {
          customValues.push([
            fieldsMetadata,
            `this.constructor[Symbol.metadata][${Metadata.symbolName}]`,
          ]);
        }
        customValues.push([
          customValue,
          `${fieldsMetadata}.getField("${field.name}").custom.fn(${value})`,
        ]);

        value = customValue;
      }

      if (field.default !== undefined) {
        const isDefault = `equal(${JSON.stringify(field.default())}, ${value})`;

        if (
          metadata.transparent !== undefined &&
          field.name !== metadata.transparent
        ) {
          canFieldAllowTransprency.push(isDefault);
        }

        value = `${isDefault} ? undefined : ${value}`;
      }

      if (field.path !== undefined) {
        const pathParts = field.path.split("/");
        let current = objectProps;
        for (const pathPart of pathParts) {
          if (current[pathPart] === undefined) {
            current[pathPart] = {};
          }
          current = current[pathPart] as ObjectProps;
        }
        current[key] = value;
      } else {
        objectProps[key] = value;
      }

      if (
        metadata.transparent !== undefined &&
        field.name !== metadata.transparent
      ) {
        canClassBeTransparent.push(
          `(${canFieldAllowTransprency.join(" || ")})`,
        );
      }
    }

    for (const [name, value] of customValues) {
      body += `const ${name}=${value};`;
    }

    const appendObjectProps = (objectProps: ObjectProps) => {
      body += "{";
      for (const [key, value] of Object.entries(objectProps)) {
        if (key === "...") {
          body += `...${value}`;
        } else {
          body += `"${key}":`;
          if (typeof value === "string") {
            body += value;
          } else {
            appendObjectProps(value);
          }
        }
        body += ",";
      }
      body += "}";
    };

    if (canClassBeTransparent.length > 0) {
      body += "const result =";
      appendObjectProps(objectProps);
      body += ";";
    } else if (metadata.transparent === undefined) {
      body += "return ";
      appendObjectProps(objectProps);
      body += ";";
    }

    if (metadata.transparent !== undefined) {
      const transparentField = metadata.getField(metadata.transparent)!;
      let value: string;
      if (transparentField.custom !== undefined) {
        value = `customValue${transparentField.index}`;
      } else {
        value = `this["${transparentField.name}"]`;
      }

      value = `${value}?.toJSON?.() ?? ${value}`;

      if (canClassBeTransparent.length > 0) {
        body += `if (${canClassBeTransparent.join(" && ")}) return ${value};`;
      } else {
        body += `return ${value};`;
      }
    }

    if (canClassBeTransparent.length > 0) {
      body += `return result;`;
    }
  } else if (metadata.transparent !== undefined) {
    body += `return this["${metadata.transparent}"];`;
  } else {
    body += "return {};";
  }

  return new Function(Metadata.symbolName, "equal", body);
}
