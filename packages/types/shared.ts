/** Takes the properties of `T` and returns a matching object based on `Required` and `Optional`. */
export type InputProps<
  T,
  Required extends keyof T,
  Optional extends Exclude<keyof T, Required> = never,
> =
  & Pick<T, Required>
  & Partial<Pick<T, Optional>>;
