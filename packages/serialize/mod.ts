import { toSnakeCase } from "@std/text";
import { equal } from "@std/assert";

export interface MetadataContext<Instance, FieldName extends keyof Instance> {
  readonly metadata: {
    fields?: Record<string, FieldOptions<Instance, FieldName> | undefined>;
  };
}

export interface FieldOptions<Instance, FieldName extends keyof Instance> {
  default?: () => Instance[FieldName];
  custom?: [(value: Instance[FieldName]) => unknown, "normal" | "merge"];
  rename?: string;
}

export interface ClassOptions<FieldName> {
  transparent?: FieldName;
}

// deno-lint-ignore no-explicit-any
export type Constructor = abstract new (...args: any[]) => any;

export function Serialize<
  T extends Constructor | undefined,
  InstanceForClass extends T extends Constructor ? InstanceType<T> : never,
  InstanceForField extends T extends Constructor ? never : unknown,
  FieldNameForField extends keyof InstanceForField,
  FieldNameForClass extends {
    [P in keyof InstanceForClass]: InstanceForClass[P] extends
      (...args: unknown[]) => unknown ? never
      : P;
  }[keyof InstanceForClass],
>(
  opts?: T extends Constructor ? ClassOptions<FieldNameForClass>
    : FieldOptions<InstanceForField, FieldNameForField>,
): (
  target: T,
  ctx: T extends Constructor ?
      & ClassDecoratorContext
      & MetadataContext<InstanceForClass, FieldNameForClass>
    :
      & ClassFieldDecoratorContext<
        InstanceForField,
        InstanceForField[FieldNameForField]
      >
      & MetadataContext<InstanceForField, FieldNameForField>
      & { name: FieldNameForField },
) => void {
  return (target, ctx) => {
    if (ctx.kind === "class" && target !== undefined) {
      classImpl(opts as ClassOptions<FieldNameForClass> ?? {}, target, ctx);
    } else if (ctx.kind === "field" && target === undefined) {
      fieldImpl(
        opts as FieldOptions<InstanceForField, FieldNameForField> ?? {},
        ctx,
      );
    }
  };
}

function fieldImpl<T, FieldName extends keyof T>(
  opts: FieldOptions<T, FieldName>,
  ctx:
    & ClassFieldDecoratorContext<T, T[FieldName]>
    & MetadataContext<T, FieldName>,
): void {
  if (ctx.metadata.fields === undefined) ctx.metadata.fields = {};
  if (typeof ctx.name !== "symbol") {
    ctx.metadata.fields[ctx.name] = opts;
  }
}

function classImpl<
  T extends Constructor,
  FieldName extends keyof InstanceType<T>,
>(
  classOpts: ClassOptions<FieldName>,
  target: T,
  ctx: ClassDecoratorContext & MetadataContext<InstanceType<T>, FieldName>,
): void {
  const getMetadata = (fieldName: string, data: string): string => {
    return `this.constructor[Symbol.metadata]?.fields?.["${fieldName}"]?.${data}`;
  };

  const transparent = classOpts?.transparent;
  if (transparent !== undefined && typeof transparent !== "string") {
    throw new Error(
      `Transparent field "${String(transparent)}" must be a string`,
    );
  }

  let toJsonBody = "";
  if (ctx.metadata.fields !== undefined) {
    const fieldsLength = Object.keys(ctx.metadata.fields).length;

    let isTransparentCheck = "";

    toJsonBody += "{";
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

      toJsonBody += keyValuePair;
    }
    toJsonBody += "}";

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

      toJsonBody = `(${isTransparentCheck}) ? ${value} : ${toJsonBody}`;
    }
  } else {
    if (classOpts?.transparent !== undefined) {
      toJsonBody = `this["${String(classOpts.transparent)}"]`;
    } else {
      toJsonBody = "{}";
    }
  }
  toJsonBody = "return " + toJsonBody;

  const toJsonFn = new Function("equal", toJsonBody);
  Object.defineProperty(target.prototype, "toJSON", {
    value() {
      return toJsonFn.call(this, equal);
    },
    configurable: true,
    writable: true,
  });
}
