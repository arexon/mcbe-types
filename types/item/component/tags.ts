import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser()
export class TagsItemComponent implements ComponentNamespace {
  @Ser({ default: () => [] })
  tags: string[];

  get namespace(): string {
    return "minecraft:tags";
  }

  constructor(...tags: string[]) {
    this.tags = tags;
  }
}
