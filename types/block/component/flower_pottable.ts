import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser()
export class FlowerPottableBlockComponent implements ComponentNamespace {
  get namespace(): string {
    return "minecraft:flower_pottable";
  }
}
