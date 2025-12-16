import { toSnakeCase } from "@std/text";
import { equal } from "@std/assert";

export interface SerContext<Instance, Name extends keyof Instance> {
  readonly metadata: {
    fields?: Map<string, SerFieldOptions<Instance, Name> | undefined>;
  };
}

export interface SerFieldOptions<Instance, Name extends keyof Instance> {
  default?: () => Instance[Name];
  custom?: (value: Instance[Name]) => unknown;
  rename?: string;
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
  ctx: ClassDecoratorContext & SerContext<Instance, never>,
) => void {
  return function (target, ctx) {
    // TODO: Experiment with generating `Function`.
    Object.defineProperty(target.prototype, "toJSON", {
      value() {
        interface InspectedField {
          name: string;
          opts?: SerFieldOptions<Instance, never>;
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
              equal(fieldOpts.default(), this[fieldName]),
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
          const field = inspectedFields
            .find((field) => field.name === classOpts.transparent)!;

          let value = this[classOpts.transparent];

          // This is to allow for cases where the transparent field is a getter.
          if (field === undefined && value !== undefined) return value;

          if (
            field.opts !== undefined &&
            field.opts.custom !== undefined
          ) return field.opts.custom(this[classOpts.transparent]);

          if (field.isDefault) value = undefined;
          else if (value["toJSON"] !== undefined) value = value.toJSON();
          return value;
        } else {
          const object: Record<string, unknown> = {};
          for (const field of inspectedFields) {
            let value = this[field.name];
            if (field.isDefault) value = undefined;
            else if (value !== undefined && value["toJSON"] !== undefined) {
              value = value.toJSON();
            }
            let key = toSnakeCase(field.name);

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
