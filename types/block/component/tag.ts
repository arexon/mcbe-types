import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser()
export class TagBlockComponent implements ComponentNamespace {
  #namespace: `tag:${string}`;

  get namespace(): string {
    return this.#namespace;
  }

  constructor(input: string) {
    this.#namespace = `tag:${input}`;
  }
}
