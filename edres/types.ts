import type { AnyConstructor } from "@std/assert";

/** Shorthand for constructing compound types. */
export const t: {
  number(): EdresNumber;
  string(): EdresString;
  boolean(): EdresBoolean;
  literal<T extends string>(value: T): EdresLiteral<T>;
  optional<T extends EdresType>(value: T): EdresOptional<T>;
  object<T extends Record<string, EdresType>>(fields: T): EdresObject<T>;
  array<T extends EdresType>(element: T): EdresArray<T>;
  union<T extends EdresType[]>(...options: T): EdresUnion<T>;
  tuple<T extends EdresType[]>(...items: T): EdresTuple<T>;
  custom<T extends AnyConstructor>(inner: T): EdresCustom<T>;
} = {
  number(): EdresNumber {
    return new EdresNumber();
  },
  string(): EdresString {
    return new EdresString();
  },
  boolean(): EdresBoolean {
    return new EdresBoolean();
  },
  literal<T extends string>(value: T): EdresLiteral<T> {
    return new EdresLiteral(value);
  },
  optional<T extends EdresType>(value: T): EdresOptional<T> {
    return new EdresOptional(value);
  },
  object<T extends Record<string, EdresType>>(fields: T): EdresObject<T> {
    return new EdresObject(fields);
  },
  array<T extends EdresType>(element: T): EdresArray<T> {
    return new EdresArray(element);
  },
  union<T extends EdresType[]>(...options: T): EdresUnion<T> {
    return new EdresUnion(options);
  },
  tuple<T extends EdresType[]>(...items: T): EdresTuple<T> {
    return new EdresTuple(items);
  },
  custom<T extends AnyConstructor>(inner: T): EdresCustom<T> {
    return new EdresCustom(inner);
  },
} as const;

/**
 * Infers any `T` of {@link EdresType}.
 *
 * @example Usage
 * ```ts
 * const list = t.tuple(t.string(), t.number(), t.literal("foo"));
 * type _ = Infer<typeof list> // [string, number, "foo"];
 * ```
 */
export type Infer<T extends EdresType> = T extends EdresNumber ? number
  : T extends EdresString ? string
  : T extends EdresBoolean ? boolean
  : T extends EdresLiteral<infer T> ? T
  : T extends EdresOptional<infer T> ? (Infer<T> | undefined)
  : T extends EdresObject<infer T> ? { [K in keyof T]: Infer<T[K]> }
  : T extends EdresArray<infer T> ? Infer<T>[]
  : T extends EdresUnion<infer T> ? Infer<T[number]>
  : T extends EdresTuple<infer T> ? { [K in keyof T]: Infer<T[K]> }
  : T extends EdresCustom<infer T> ? InstanceType<T>
  : never;

/** Any Edres type. */
export type EdresType =
  | EdresNumber
  | EdresString
  | EdresBoolean
  | EdresLiteral<string>
  | EdresOptional<EdresType>
  | EdresObject<Record<string, EdresType>>
  | EdresArray<EdresType>
  | EdresUnion<EdresType[]>
  | EdresTuple<EdresType[]>
  | EdresCustom<AnyConstructor>;

export class EdresNumber {
  kind: "number" = "number";
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  exclusiveMaximum?: number;

  /**
   * Enforce to be greater than {@link value}.
   *
   * Equivalent to {@link EdresNumber.min()}.
   */
  gt(value: number): this {
    this.minimum = value;
    return this;
  }

  /** Enforce to be greater than or equal to {@link value}. */
  gte(value: number): this {
    this.exclusiveMinimum = value;
    return this;
  }

  /**
   * Enforce to be less than {@link value}.
   *
   * Equivalent to {@link EdresNumber.max()}.
   */
  lt(value: number): this {
    this.maximum = value;
    return this;
  }

  /** Enforce to be less than or equal to {@link value}. */
  lte(value: number): this {
    this.exclusiveMaximum = value;
    return this;
  }

  /**
   * Enforce to be greater than {@link value}.
   *
   * Equivalent to {@link EdresNumber.gt()}.
   */
  min(value: number): this {
    this.minimum = value;
    return this;
  }

  /**
   * Enforce to be greater than {@link value}.
   *
   * Equivalent to {@link EdresNumber.lt()}.
   */
  max(value: number): this {
    this.maximum = value;
    return this;
  }
}

export class EdresString {
  kind: "string" = "string";
}

export class EdresBoolean {
  kind: "boolean" = "boolean";
}

export class EdresLiteral<T extends string> {
  kind: "literal" = "literal";
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

export class EdresOptional<T extends EdresType> {
  kind: "optional" = "optional";
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

export class EdresObject<T extends Record<string, EdresType>> {
  kind: "object" = "object";
  fields: T;

  constructor(fields: T) {
    this.fields = fields;
  }
}

export class EdresArray<T extends EdresType> {
  kind: "array" = "array";
  element: T;

  constructor(element: T) {
    this.element = element;
  }
}

export class EdresUnion<T extends EdresType[]> {
  kind: "union" = "union";
  options: T;

  constructor(options: T) {
    this.options = options;
  }
}

export class EdresTuple<T extends EdresType[]> {
  kind: "tuple" = "tuple";
  items: T;

  constructor(items: T) {
    this.items = items;
  }
}

export class EdresCustom<T extends AnyConstructor> {
  kind: "custom" = "custom";
  inner: T;

  constructor(inner: T) {
    this.inner = inner;
  }
}

/**
 * Walks through the type definition and optimizes it.
 *
 * Currently it does the following:
 * 1. Flatten direct union options
 */
export function optimizeType(type: EdresType) {
  if (type.kind === "union") {
    type.options = flattenUnionOptions(type.options);
  } else if (type.kind === "tuple") {
    type.items.map(optimizeType);
  } else if (type.kind === "array") {
    optimizeType(type.element);
  } else if (type.kind === "object") {
    for (const key in type.fields) {
      optimizeType(type.fields[key]);
    }
  } else if (type.kind === "optional") {
    optimizeType(type.value);
  }
}

function flattenUnionOptions(options: EdresType[]): EdresType[] {
  const flattened: EdresType[] = [];
  for (const option of options) {
    if (option.kind === "union") {
      flattened.push(...flattenUnionOptions(option.options));
    } else {
      optimizeType(option);
      flattened.push(option);
    }
  }
  return flattened;
}
