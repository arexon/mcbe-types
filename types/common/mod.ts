export * from "./component/mod.ts";

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
