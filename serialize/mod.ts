/**
 * Simple serialization library powered by decorators. Inspired by [Serde](https://serde.rs).
 *
 * @module
 */

import { type AnyConstructor, equal } from "@std/assert";
import { toSnakeCase } from "@std/text";

/** Options to configure how a field should be serialized. */
export interface FieldOptions<FieldValue = unknown> {
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
export interface ClassOptions<FieldName = string> {
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
  options?: Ctx extends { kind: "class" } ? ClassOptions<
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
      return fieldImpl(ctx, options as FieldOptions);
    } else if (ctx.kind === "class") {
      classImpl(ctx, target!, options as ClassOptions);
    }
  };
}

interface ContextMetadata {
  readonly metadata: {
    [Metadata.symbol]?: Metadata;
  };
}

function fieldImpl(
  ctx: ClassFieldDecoratorContext & ContextMetadata,
  options?: FieldOptions,
): void {
  ctx.metadata[Metadata.symbol] ??= new Metadata();
  if (typeof ctx.name !== "symbol") {
    ctx.metadata[Metadata.symbol]!.setField(ctx.name, options ?? {});
  }
}

function classImpl(
  ctx: ClassDecoratorContext & ContextMetadata,
  ctor: AnyConstructor,
  options: ClassOptions,
): void {
  if ("toJSON" in ctor.prototype) {
    throw new Error(
      `Class ${ctx.name} already has a toJSON() method defined`,
    );
  }

  ctx.metadata[Metadata.symbol] ??= new Metadata();
  const metadata = ctx.metadata[Metadata.symbol]!;
  metadata.transparent = options?.transparent;

  const body = generateToJson(metadata);
  const fn = new Function(Metadata.symbolName, "equal", body);

  Object.defineProperty(ctor.prototype, "toJSON", {
    value() {
      return fn.call(this, Metadata.symbol, equal);
    },
    configurable: true,
    writable: true,
  });
}

const SPECIAL_CHARACTERS_REGEXP = /[$&+,:;=?@#|'<>.^*()%!-]/;
const CUSTOM_OVERRIDE_PREFIX = "customOverride";
const RESULT_VAR = "result";
const FIELDS_METADATA_VAR = "fieldsMetadata";
const MERGE_KEY = "...";

interface FieldMetadata {
  index: number;
  name: string;
  default?: () => unknown;
  custom?: { fn: (value: unknown) => unknown; strategy: "normal" | "merge" };
  rename?: string;
  path?: string[];
}

class Metadata {
  static readonly symbol = Symbol();
  static readonly symbolName = "metadataSymbol";

  length = 0;
  fields: Record<string, FieldMetadata> = {};
  transparent?: string;

  setField(name: string, options: FieldOptions): void {
    this.fields[name] = {
      index: this.length,
      name,
      custom: options.custom !== undefined
        ? { fn: options.custom[0], strategy: options.custom[1] }
        : undefined,
      default: options.default,
      rename: options.rename,
      path: options.path?.split("/"),
    };
    this.length++;
  }

  getKey(name: string): string {
    const field = this.fields[name];
    if (field.custom?.strategy === "merge") {
      return MERGE_KEY;
    } else if (field.rename !== undefined) {
      return field.rename;
    } else if (!SPECIAL_CHARACTERS_REGEXP.test(field.name)) {
      return toSnakeCase(field.name);
    } else {
      return field.name;
    }
  }
}

type ObjectProps = { [key: string]: string | ObjectProps };

function generateToJson(metadata: Metadata): string {
  let body = "";
  const objectProps: ObjectProps = {};
  const transparencyChecks: string[] = [];
  const consts: [string, string][] = [];

  if (metadata.length > 0) {
    for (const field of Object.values(metadata.fields)) {
      const isNotTransparent = metadata.transparent !== undefined &&
        field.name !== metadata.transparent;
      const key = metadata.getKey(field.name);
      let value = `this["${field.name}"]`;

      const transparencyCheck = [];
      if (isNotTransparent) {
        transparencyCheck.push(`${value} === undefined`);
      }

      if (field.default !== undefined || field.custom !== undefined) {
        if (consts.length === 0) {
          consts.push([
            FIELDS_METADATA_VAR,
            `this.constructor[Symbol.metadata][${Metadata.symbolName}]`,
          ]);
        }
      }

      if (field.custom !== undefined) {
        const customOverride = CUSTOM_OVERRIDE_PREFIX + field.index;
        consts.push([
          customOverride,
          `${FIELDS_METADATA_VAR}.fields["${field.name}"].custom.fn(${value})`,
        ]);
        value = customOverride;
      }

      if (field.default !== undefined) {
        const isDefault =
          `equal(${FIELDS_METADATA_VAR}.fields["${field.name}"].default(), ${value})`;
        if (isNotTransparent) {
          transparencyCheck.push(isDefault);
        }
        value = `${isDefault} ? undefined : ${value}`;
      }

      if (field.path !== undefined) {
        let current = objectProps;
        for (const part of field.path) {
          current[part] ??= {};
          current = current[part] as ObjectProps;
        }
        current[key] = value;
      } else {
        objectProps[key] = value;
      }

      if (isNotTransparent) {
        transparencyChecks.push(`(${transparencyCheck.join(" || ")})`);
      }
    }

    const appendObjectProps = (objectProps: ObjectProps) => {
      body += "{";
      for (const [key, value] of Object.entries(objectProps)) {
        if (key === MERGE_KEY) {
          body += MERGE_KEY + value;
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

    for (const [name, value] of consts) {
      body += `const ${name}=${value};`;
    }

    if (transparencyChecks.length > 0) {
      body += `const ${RESULT_VAR} =`;
      appendObjectProps(objectProps);
      body += ";";
    } else if (metadata.transparent === undefined) {
      body += "return ";
      appendObjectProps(objectProps);
      body += ";";
    }

    if (metadata.transparent !== undefined) {
      const transparentField = metadata.fields[metadata.transparent]!;
      let value: string;
      if (transparentField.custom !== undefined) {
        value = CUSTOM_OVERRIDE_PREFIX + transparentField.index;
      } else {
        value = `this["${transparentField.name}"]`;
      }

      value = `${value}?.toJSON?.() ?? ${value}`;

      if (transparencyChecks.length > 0) {
        body += `if(${transparencyChecks.join(" && ")})return ${value};`;
      } else {
        body += `return ${value};`;
      }
    }

    if (transparencyChecks.length > 0) {
      body += `return ${RESULT_VAR};`;
    }
  } else if (metadata.transparent !== undefined) {
    body += `return this["${metadata.transparent}"];`;
  } else {
    body += "return {};";
  }

  return body;
}
