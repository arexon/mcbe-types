import { SerClass, SerField } from "@mcbe/serialize";

@SerClass({ transparent: "version" })
export class FormatVersion {
  @SerField()
  version: string;

  constructor(version: [number, number, number]) {
    this.version = `${version[0]}.${version[1]}.${version[2]}`;
  }
}

/** This is only meant for {@link NamespacedContainer}. */
type NamespacedClass = {
  // deno-lint-ignore no-explicit-any
  new (...args: any[]): any;
  namespace: string;
};

/**
 * Collection of `I[]` where `I` defines a namespace.
 * Serializes into an object where the namespace is used the property key for `I`.
 */
@SerClass({ transparent: "collection" })
export class NamespacedContainer<
  T extends NamespacedClass,
  TInstance extends InstanceType<T> = InstanceType<T>,
> {
  // TODO(@arexon): Make this field private.
  @SerField()
  collection: Record<string, TInstance>;

  constructor(collection: TInstance[]) {
    this.collection = {};
    for (const value of collection) {
      const key = value.constructor.namespace as string;
      if (this.collection[key] !== undefined) {
        throw new DuplicateComponentError(key);
      }
      this.collection[key] = value;
    }
  }

  add(value: TInstance): this {
    const key = value.constructor.namespace as string;
    if (this.collection[key] !== undefined) {
      throw new DuplicateComponentError(key);
    }
    this.collection[key] = value;
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
