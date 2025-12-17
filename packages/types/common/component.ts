import { SerClass, SerField } from "@mcbe/serialize";
import type { LocalizationText } from "@mcbe/types/text";

/** Component collection of `T` keyed by the namespace of `T`. */
@SerClass({ transparent: "value" })
export class Components<T extends { namespace: string }> {
  #value: Record<string, T> = {};

  get value(): Record<string, T> {
    return this.#value;
  }

  constructor(...components: T[]) {
    for (const comp of components) {
      const key = comp.namespace;
      if (this.has(key)) {
        throw new DuplicateComponentError(key);
      }
      this.#value[key] = comp;
    }
  }

  add(...components: T[]): void {
    for (const comp of components) {
      const key = comp.namespace;
      if (this.has(key)) {
        throw new DuplicateComponentError(key);
      }
      this.#value[key] = comp;
    }
  }

  remove(namespace: string): boolean {
    if (this.has(namespace)) {
      delete this.#value[namespace];
      return true;
    }
    return false;
  }

  has(namespace: string): boolean {
    return Object.hasOwn(this.#value, namespace);
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
export class DisplayNameComponent {
  @SerField()
  value: LocalizationText;

  readonly namespace = "minecraft:display_name";

  constructor(value: LocalizationText) {
    this.value = value;
  }
}

/**
 * Common custom component for blocks and items.
 *
 * @example Usage with custom schema
 * ```ts
 * interface PaintableCustomComponent {
 *   namespace: "custom:paintable";
 *   params: { colors: string[] };
 * }
 *
 * new CustomComponent<PaintableCustomComponent>("custom:paintable", {
 *   colors: ["red", "blue"],
 * });
 * ```
 */
@SerClass({ transparent: "params" })
export class CustomComponent<
  // deno-lint-ignore no-explicit-any
  Schema extends { namespace: string; params: unknown } = any,
  Namespace extends string = Schema["namespace"],
> {
  @SerField()
  params: unknown;

  #namespace: string;

  get namespace(): string {
    return this.#namespace;
  }

  constructor(namespace: Namespace, params: Schema["params"]) {
    this.params = params;
    this.#namespace = namespace;
  }
}
