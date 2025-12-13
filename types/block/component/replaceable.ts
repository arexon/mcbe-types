import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser()
export class ReplaceableBlockComponent implements ComponentNamespace {
  get namespace(): string {
    return "minecraft:replaceable";
  }
}
