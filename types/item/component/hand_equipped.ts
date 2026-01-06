import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class HandEquippedItemComponent implements ComponentNamespace {
  @Ser()
  value: boolean;

  get namespace(): string {
    return "minecraft:hand_equipped";
  }

  constructor(value: boolean) {
    this.value = value;
  }
}
