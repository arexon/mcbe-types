import { SerClass } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@SerClass()
export class ReplaceableBlockComponent implements ComponentNamespace {
  get namespace(): string {
    return "minecraft:replaceable";
  }
}
