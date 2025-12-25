import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Serialize()
export class ReplaceableBlockComponent implements ComponentNamespace {
  get namespace(): string {
    return "minecraft:replaceable";
  }
}
