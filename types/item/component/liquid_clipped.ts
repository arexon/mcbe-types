import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class LiquidClippedItemComponent implements ComponentNamespace {
  @Ser()
  value: boolean;

  get namespace(): string {
    return "minecraft:liquid_clipped";
  }

  constructor(input: boolean) {
    this.value = input;
  }
}
