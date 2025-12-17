import { SerClass, SerField } from "@mcbe/serialize";

@SerClass({ transparent: "value" })
export class BreathabilityBlockComponent {
  @SerField({ default: () => "solid" })
  value: "air" | "solid";

  get namespace(): string {
    return "minecraft:breathability";
  }

  constructor(value: BreathabilityBlockComponent["value"]) {
    this.value = value;
  }
}
