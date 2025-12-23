import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Serialize({ transparent: "path" })
export class LootBlockComponent implements ComponentNamespace {
  @Serialize()
  path: string;

  get namespace(): string {
    return "minecraft:loot";
  }

  constructor(path: string) {
    this.path = path;
  }
}
