import { toSnakeCase } from "@std/text";
import { equal } from "@std/assert";
import { deepMerge } from "@std/collections";

export interface SerContext<Instance, Name extends keyof Instance> {
  readonly metadata: {
    fields?: Map<string, SerFieldOptions<Instance, Name> | undefined>;
  };
}

export interface CustomSerResult {
  value: unknown;
  strategy: "normal" | "merge";
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
    if (ctx.metadata.fields === undefined) {
      ctx.metadata.fields = new Map();
    }
    if (typeof ctx.name !== "symbol") {
      ctx.metadata.fields.set(ctx.name, opts);
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
  const transparent = classOpts?.transparent;
  if (transparent !== undefined && typeof transparent !== "string") {
    throw new Error(
      `Transparent field "${String(transparent)}" must be a string`,
    );
  }

  return function (target, ctx) {
    let body = "";
    const env: Record<string, unknown> = {
      equal: equal,
      deepMerge: deepMerge,
    };

    if (ctx.metadata.fields !== undefined && ctx.metadata.fields.size > 0) {
      const customValuesToMerge: string[] = [];
      const getCustomKeyAndValue = (
        fieldName: string,
        value: string,
      ): [string, string] => {
        const customKey = `__${fieldName}_custom`;
        const customValue = `env["${customKey}"](${value})`;
        return [customKey, customValue];
      };

      let isTransparentCheck = "";

      body += "{";
      let index = -1;
      for (const [fieldName, fieldOpts] of ctx.metadata.fields) {
        index += 1;

        const isTransparentFieldCheck = `"${fieldName}" === "${
          transparent ?? ""
        }"`;

        let key: string;
        if (fieldOpts?.rename !== undefined) key = fieldOpts.rename;
        else if (!fieldName.includes(":")) key = toSnakeCase(fieldName);
        else key = fieldName;

        const initialValue = `this["${fieldName}"]`;
        let value = "";
        if (fieldOpts?.default !== undefined) {
          const isDefaultCheck = `env.equal(${
            JSON.stringify(fieldOpts.default())
          }, ${initialValue})`;

          if (transparent !== undefined) {
            isTransparentCheck +=
              `(${isTransparentFieldCheck} || ${isDefaultCheck} || ${initialValue} === undefined)`;
          }

          value = `${isDefaultCheck} ? undefined : ${initialValue}`;
        } else {
          value = initialValue;

          if (transparent !== undefined) {
            isTransparentCheck +=
              `(${isTransparentFieldCheck} || ${initialValue} === undefined)`;
          }
        }

        if (fieldOpts?.custom !== undefined) {
          const [customKey, customValue] = getCustomKeyAndValue(
            fieldName,
            value,
          );
          env[customKey] = fieldOpts.custom[0];

          if (fieldOpts.custom[1] === "normal") {
            value = customValue;

            if (transparent !== undefined) {
              isTransparentCheck =
                `(${isTransparentFieldCheck} || ${customValue} === undefined)`;
            }
          } else if (fieldOpts.custom[1] === "merge") {
            customValuesToMerge.push(customValue);
            continue;
          }
        }

        if (transparent !== undefined && index < ctx.metadata.fields.size - 1) {
          isTransparentCheck += " && ";
        }

        body += `"${key}": ${value},`;
      }
      body += "}";

      if (customValuesToMerge.length > 0) {
        body = customValuesToMerge.reduce(
          (body, customValue) => `env.deepMerge(${body}, ${customValue})`,
          body,
        );
      }

      const transparentField = ctx.metadata.fields.entries()
        .find((field) => field[0] === transparent);
      if (transparentField !== undefined && isTransparentCheck !== "") {
        const [transparentFieldName, transparentFieldOpts] = transparentField;
        let value = `this["${transparentFieldName}"]`;
        value = `(${value}?.toJSON?.() ?? ${value})`;

        if (transparentFieldOpts?.custom !== undefined) {
          const [_, customValue] = getCustomKeyAndValue(
            transparentFieldName,
            value,
          );
          value = customValue;
        }

        body = `(${isTransparentCheck}) ? ${value} : ${body}`;
      }
    } else {
      if (classOpts?.transparent !== undefined) {
        body = `this["${String(classOpts.transparent)}"] ?? undefined`;
      } else {
        body = "{}";
      }
    }
    body = "return " + body;

    const fn = new Function("env", body);

    Object.defineProperty(target.prototype, "toJSON", {
      value() {
        return fn.call(this, env);
      },
      configurable: true,
      writable: true,
    });
  };
}
