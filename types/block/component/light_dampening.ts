import { Edres } from "@mcbe/edres";
import type { ComponentNamespace } from "@mcbe/types/common";

@Edres({ transparent: "value" })
export class LightDampeningBlockComponent implements ComponentNamespace {
  @Edres({ default: () => 15 })
  value: number;

  get namespace(): string {
    return "minecraft:light_dampening";
  }

  constructor(value: number) {
    this.value = value;
  }
}
