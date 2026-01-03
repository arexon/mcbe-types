import { Edres } from "@mcbe/edres";
import type { ComponentNamespace } from "@mcbe/types/common";

@Edres()
export class ReplaceableBlockComponent implements ComponentNamespace {
  get namespace(): string {
    return "minecraft:replaceable";
  }
}
