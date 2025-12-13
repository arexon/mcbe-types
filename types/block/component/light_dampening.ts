import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class LightDampeningBlockComponent implements ComponentNamespace {
  @Ser({ default: () => 15 })
  value: number;

  get namespace(): string {
    return "minecraft:light_dampening";
  }

  constructor(value: number) {
    this.value = value;
  }
}
