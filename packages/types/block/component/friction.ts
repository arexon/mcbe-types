import { SerClass, SerField } from "@mcbe/serialize";

@SerClass({ transparent: "value" })
export class FrictionBlockComponent {
  @SerField({ default: () => 0.4 })
  value: number;

  readonly namespace = "minecraft:friction";

  constructor(value: number) {
    this.value = value;
  }
}
