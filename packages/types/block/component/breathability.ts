import { SerClass, SerField } from "@mcbe/serialize";

@SerClass({ transparent: "value" })
export class BreathabilityBlockComponent {
  @SerField({ default: () => "solid" })
  value: "air" | "solid";

  static namespace: string = "minecraft:breathability";

  constructor(value: BreathabilityBlockComponent["value"]) {
    this.value = value;
  }
}
