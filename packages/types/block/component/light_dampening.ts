import { SerClass, SerField } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@SerClass({ transparent: "value" })
export class LightDampeningBlockComponent implements ComponentNamespace {
  @SerField({ default: () => 15 })
  value: number;

  get namespace(): string {
    return "minecraft:light_dampening";
  }

  constructor(value: number) {
    this.value = value;
  }
}
