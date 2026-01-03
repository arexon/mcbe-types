import { Edres } from "@mcbe/edres";
import type { ComponentNamespace } from "@mcbe/types/common";

@Edres({ transparent: "path" })
export class LootBlockComponent implements ComponentNamespace {
  @Edres()
  path: string;

  get namespace(): string {
    return "minecraft:loot";
  }

  constructor(path: string) {
    this.path = path;
  }
}
