import { SerClass, SerField } from "@mcbe/serialize";

@SerClass({ transparent: "value" })
export class LightDampeningBlockComponent {
  @SerField({ default: () => 15 })
  value: number;

  get namespace(): string {
    return "minecraft:light_dampening";
  }

  constructor(value: number) {
    this.value = value;
  }
}
