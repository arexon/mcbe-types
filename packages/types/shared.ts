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
  I extends InstanceType<T> = InstanceType<T>,
> {
  @SerField({
    custom: (collection) =>
      collection.map((value) => ({
        [value.constructor.namespace]: value,
      })),
  })
  collection: I[];

  constructor(collection: I[]) {
    this.collection = collection;
  }

  add(value: I): this {
    this.collection.push(value);
    return this;
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
