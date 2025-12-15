import { SerClass, SerField } from "@mcbe/serialize";

@SerClass({ transparent: "version" })
export class FormatVersion {
  @SerField()
  version: string;

  constructor(version: [number, number, number]) {
    this.version = `${version[0]}.${version[1]}.${version[2]}`;
  }
}

/** Component collection of `T` keyed by the namespace of `T`. */
@SerClass({ transparent: "value" })
export class Components<
  T extends { readonly namespace: string },
  Custom,
  Namespaces = Exclude<T, CustomComponent> | Custom extends
    { readonly namespace: infer N } ? N : never,
> {
  #value: Record<string, T> = {};

  get value(): Record<string, T> {
    return this.#value;
  }

  constructor(...components: T[]) {
    for (const comp of components) {
      const key = comp.namespace;
      if (this.has(key as Namespaces)) {
        throw new DuplicateComponentError(key);
      }
      this.#value[key] = comp;
    }
  }

  add(...components: T[]): void {
    for (const comp of components) {
      const key = comp.namespace;
      if (this.has(key as Namespaces)) {
        throw new DuplicateComponentError(key);
      }
      this.#value[key] = comp;
    }
  }

  remove(namespace: Namespaces): boolean {
    if (this.has(namespace)) {
      delete this.#value[namespace as string];
      return true;
    }
    return false;
  }

  has(namespace: Namespaces): boolean {
    return this.#value[namespace as string] !== undefined;
  }

  clear(): void {
    this.#value = {};
  }

  [Symbol.iterator](): Iterator<T> {
    const propNames = Object.getOwnPropertyNames(this.#value);
    return {
      next: (): IteratorResult<T> => {
        const propName = propNames.pop();
        if (propName !== undefined) {
          return { value: this.#value[propName]!, done: false };
        } else {
          return { value: undefined, done: true };
        }
      },
    };
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

  get namespace(): Namespace {
    return this.#namespace;
  }

  constructor(namespace: Namespace, value: Value) {
    this.value = value;
    this.#namespace = namespace;
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
