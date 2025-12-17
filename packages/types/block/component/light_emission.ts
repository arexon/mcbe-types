import { SerClass, SerField } from "@mcbe/serialize";

@SerClass({ transparent: "value" })
export class LightEmissionBlockComponent {
  @SerField({ default: () => 0 })
  value: number;

  get namespace(): string {
    return "minecraft:light_emission";
  }

  constructor(value: number) {
    this.value = value;
  }
}
