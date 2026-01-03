import { Edres } from "@mcbe/edres";
import type { ComponentNamespace } from "@mcbe/types/common";

@Edres()
export class FlowerPottableBlockComponent implements ComponentNamespace {
  get namespace(): string {
    return "minecraft:flower_pottable";
  }
}
