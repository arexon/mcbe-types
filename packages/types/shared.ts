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

/** Collection object of `T` where the keys are derived from the namespace. */
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

  add(...components: TInstance[]): this {
    for (const component of components) {
      const key = component.constructor.namespace as string;
      if (this.collection[key] !== undefined) {
        throw new DuplicateComponentError(key);
      }
      this.collection[key] = component;
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
