import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class InteractButtonItemComponent implements ComponentNamespace {
  @Ser()
  value: boolean | string;

  get namespace(): string {
    return "minecraft:interact_button";
  }

  constructor(value: boolean | string) {
    this.value = value;
  }
}
