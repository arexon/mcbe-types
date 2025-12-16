import { SerClass } from "@mcbe/serialize";

@SerClass()
export class TagBlockComponent {
  namespace: `tag:${string}`;

  constructor(namespace: string) {
    this.namespace = `tag:${namespace}`;
  }
}
