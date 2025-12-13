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
abstract class Namespaced {
  static namespace: string;
}

/**
 * Collection of `T[]` where T defines a namespace.
 * Serializes into an object where the namespace is used the property key for `T`.
 */
@SerClass({ transparent: "collection" })
export class NamespacedContainer<T extends Namespaced> {
  @SerField({
    custom: (collection) =>
      collection.map((value) => ({
        [(value.constructor as typeof Namespaced).namespace]: value,
      })),
  })
  collection: T[];

  constructor(collection: T[]) {
    this.collection = collection;
  }

  add(value: T): this {
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
