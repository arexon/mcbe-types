import { Edres } from "@mcbe/edres";
import type { ComponentNamespace } from "@mcbe/types/common";

@Edres()
export class TagBlockComponent implements ComponentNamespace {
  #namespace: `tag:${string}`;

  get namespace(): string {
    return this.#namespace;
  }

  constructor(namespace: string) {
    this.#namespace = `tag:${namespace}`;
  }
}
