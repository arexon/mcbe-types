import { toSnakeCase } from "@std/text";

export interface SerContext<Value> {
  readonly metadata: {
    fields?: Map<string, SerFieldOptions<Value> | undefined>;
  };
}

export interface SerFieldOptions<Value> {
  default?: (value: Value) => boolean;
  custom?: (value: Value) => unknown;
  rename?: string;
}

export function SerField<Value>(opts?: SerFieldOptions<Value>): (
  _target: undefined,
  ctx: ClassFieldDecoratorContext<unknown, Value> & SerContext<Value>,
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

export interface SerClassOptions<T> {
  transparent?: T;
}

export function SerClass<
  // deno-lint-ignore no-explicit-any
  T extends abstract new (...args: any[]) => InstanceType<T>,
  TInstance extends InstanceType<T>,
  Field extends {
    // deno-lint-ignore ban-types
    [P in keyof TInstance]: TInstance[P] extends Function ? never : P;
  }[keyof TInstance],
>(
  classOpts?: SerClassOptions<Field>,
): (
  target: T,
  ctx: ClassDecoratorContext & SerContext<unknown>,
) => void {
  return function (target, ctx) {
    // TODO: Experiment with generating `Function`.
    Object.defineProperty(target.prototype, "toJSON", {
      value() {
        interface InspectedField {
          name: string;
          opts?: SerFieldOptions<unknown>;
          isDefault: boolean;
          isUndefined: boolean;
          isTransparent: boolean;
        }
        const inspectedFields = ctx
          .metadata
          .fields
          ?.entries()
          .map(([fieldName, fieldOpts]): InspectedField => ({
            name: fieldName,
            opts: fieldOpts,
            isDefault: fieldOpts !== undefined &&
              fieldOpts.default !== undefined &&
              fieldOpts.default(this[fieldName]),
            isUndefined: this[fieldName] === undefined,
            isTransparent: classOpts?.transparent === fieldName,
          }))
          .toArray() ?? [];

        if (
          typeof classOpts?.transparent === "string" &&
          inspectedFields.every((field) =>
            field.isTransparent ||
            field.isUndefined ||
            field.isDefault
          )
        ) {
          const inspectedField = inspectedFields
            .find((field) => field.name === classOpts.transparent)!;
          if (
            inspectedField.opts !== undefined &&
            inspectedField.opts.custom !== undefined
          ) return inspectedField.opts.custom(this[classOpts.transparent]);
          return this[classOpts.transparent];
        } else {
          const object: Record<string, unknown> = {};
          for (const field of inspectedFields) {
            let value = this[field.name];
            let key = toSnakeCase(field.name);

            if (field.isDefault) value = undefined;
            if (field.opts !== undefined) {
              if (field.opts.custom !== undefined) {
                value = field.opts.custom(value);
              }
              if (field.opts.rename !== undefined) {
                key = field.opts.rename;
              }
            }

            object[key] = value;
          }
          return object;
        }
      },
      configurable: true,
      writable: true,
    });
  };
}
