import { equal } from "@std/assert";
import { toSnakeCase } from "@std/text";

export interface SerializeMetadata<FieldValue> {
  readonly metadata: {
    fields?: Record<string, FieldOptions<FieldValue> | undefined>;
  };
}

export interface FieldOptions<FieldValue> {
  default?: () => FieldValue;
  custom?: [(value: FieldValue) => unknown, "normal" | "merge"];
  rename?: string;
}

export interface ClassOptions<FieldName> {
  transparent?: FieldName;
}

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
  target: Ctx extends { kind: "class" } ? new (...args: unknown[]) => object
    : undefined,
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
