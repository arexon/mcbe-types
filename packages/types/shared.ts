import { SerClass, SerField } from "@mcbe/serialize";

@SerClass({ transparent: "version" })
export class FormatVersion {
  @SerField()
  version: string;

  constructor(version: [number, number, number]) {
    this.version = `${version[0]}.${version[1]}.${version[2]}`;
  }
}

/** Collection object of `T` where the keys are derived from the namespace. */
@SerClass({ transparent: "collection" })
export class NamespacedContainer<T extends { readonly namespace: string }> {
  // TODO(@arexon): Make this field private.
  @SerField()
  collection: Record<string, T>;

  constructor(...collection: T[]) {
    this.collection = {};
    for (const comp of collection) {
      const key = comp.namespace;
      if (this.collection[key] !== undefined) {
        throw new DuplicateComponentError(key);
      }
      this.collection[key] = comp;
    }
  }

  add(...components: T[]): this {
    for (const comp of components) {
      const key = comp.namespace;
      if (this.collection[key] !== undefined) {
        throw new DuplicateComponentError(key);
      }
      this.collection[key] = comp;
    }
    return this;
  }
}

// deno-lint-ignore style-guide/class-serialization
export class DuplicateComponentError extends Error {
  constructor(componentId: string) {
    super();
    this.message = `Found duplicate components with the ID "${componentId}"`;
  }
}

@SerClass({ transparent: "value" })
// deno-lint-ignore style-guide/namespace-property-in-component-class
export class CustomComponent<
  // deno-lint-ignore no-explicit-any
  T extends { readonly _namespace: string } = any,
  Value = Omit<T, "_namespace">,
  Namespace extends string = T["_namespace"],
> {
  @SerField()
  value: Value;

  #namespace: Namespace;

  constructor(namespace: Namespace, value: Value) {
    this.value = value;
    this.#namespace = namespace;
  }

  get namespace(): Namespace {
    return this.#namespace;
  }
}

/**
 * Takes the properties of `T` and returns a matching object based on
 * `OriginalProps` and `OptionalProps`.
 */
export type InputProps<
  T,
  OriginalProps extends keyof T,
  OptionalProps extends Exclude<keyof T, OriginalProps> = never,
> =
  & Pick<T, OriginalProps>
  & Partial<Pick<T, OptionalProps>>;

/** Similar to {@link InputProps} but derives the properties from `T`'s constructor `props` parameter. */
// deno-lint-ignore no-explicit-any
export type DerivedInputProps<T extends new (...args: any) => any> =
  ConstructorParameters<T>[0];
