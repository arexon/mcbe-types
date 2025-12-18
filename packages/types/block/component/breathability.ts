import { SerClass, SerField } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@SerClass({ transparent: "value" })
export class BreathabilityBlockComponent implements ComponentNamespace {
  @SerField({ default: () => "solid" })
  value: "air" | "solid";

  get namespace(): string {
    return "minecraft:breathability";
  }

  constructor(value: BreathabilityBlockComponent["value"]) {
    this.value = value;
  }
}
