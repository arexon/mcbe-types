import { Ser } from "@mcbe/serialize";

export * from "./custom.ts";
export * from "./display_name.ts";

export interface ComponentNamespace {
  get namespace(): string;
}

/** Component collection of `T` keyed by the namespace of `T`. */
@Ser({ transparent: "value" })
export class Components<T extends ComponentNamespace> {
  #value: Record<string, T> = {};

  get value(): Record<string, T> {
    return this.#value;
  }

  constructor(...components: T[]) {
    this.add(...components);
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

export class DuplicateComponentError extends Error {
  constructor(componentId: string) {
    super();
    this.message = `Found duplicate components with the ID "${componentId}"`;
  }
}
