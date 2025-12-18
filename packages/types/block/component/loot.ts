import { SerClass, SerField } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@SerClass({ transparent: "path" })
export class LootBlockComponent implements ComponentNamespace {
  @SerField()
  path: string;

  get namespace(): string {
    return "minecraft:loot";
  }

  constructor(path: string) {
    this.path = path;
  }
}
