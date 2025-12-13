import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Serialize()
export class TagBlockComponent implements ComponentNamespace {
  #namespace: `tag:${string}`;

  get namespace(): string {
    return this.#namespace;
  }

  constructor(namespace: string) {
    this.#namespace = `tag:${namespace}`;
  }
}
