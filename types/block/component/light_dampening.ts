import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Serialize({ transparent: "value" })
export class LightDampeningBlockComponent implements ComponentNamespace {
  @Serialize({ default: () => 15 })
  value: number;

  get namespace(): string {
    return "minecraft:light_dampening";
  }

  constructor(value: number) {
    this.value = value;
  }
}
