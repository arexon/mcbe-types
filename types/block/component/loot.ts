import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser({ transparent: "path" })
export class LootBlockComponent implements ComponentNamespace {
  @Ser()
  path: string;

  get namespace(): string {
    return "minecraft:loot";
  }

  constructor(path: string) {
    this.path = path;
  }
}
