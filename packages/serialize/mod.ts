import { toSnakeCase } from "@std/text";
import { equal } from "@std/assert";

export interface SerContext<Instance, Name extends keyof Instance> {
  readonly metadata: {
    fields?: Record<string, SerFieldOptions<Instance, Name> | undefined>;
  };
}

export interface SerFieldOptions<Instance, Name extends keyof Instance> {
  default?: () => Instance[Name];
  custom?: [(value: Instance[Name]) => unknown, "normal" | "merge"];
  rename?: string;
  flatten?: Instance[Name] extends Record<string, unknown> ? boolean : never;
}

export function SerField<This, Name extends keyof This>(
  opts?: SerFieldOptions<This, Name>,
): (
  _target: undefined,
  ctx:
    & ClassFieldDecoratorContext<This, This[Name]>
    & SerContext<This, Name>
    & { name: Name },
) => void {
  return function (_target, ctx) {
    if (ctx.metadata.fields === undefined) ctx.metadata.fields = {};
    if (typeof ctx.name !== "symbol") {
      ctx.metadata.fields[ctx.name] = opts;
    }
  };
}

export interface SerClassOptions<Field> {
  transparent?: Field;
}

export function SerClass<
  // deno-lint-ignore no-explicit-any
  T extends abstract new (...args: any[]) => InstanceType<T>,
  Instance extends InstanceType<T>,
  Field extends {
    // deno-lint-ignore ban-types
    [P in keyof Instance]: Instance[P] extends Function ? never : P;
  }[keyof Instance],
>(classOpts?: SerClassOptions<Field>): (
  target: T,
  ctx: ClassDecoratorContext & SerContext<Instance, Field>,
) => void {
  const getMetadata = (fieldName: string, data: string): string => {
    return `this.constructor[Symbol.metadata]?.fields?.["${fieldName}"]?.${data}`;
  };

  return function (target, ctx) {
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
  };
}
