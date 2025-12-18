import { SerClass, SerField } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@SerClass({ transparent: "value" })
export class LightEmissionBlockComponent implements ComponentNamespace {
  @SerField({ default: () => 0 })
  value: number;

  get namespace(): string {
    return "minecraft:light_emission";
  }

  constructor(value: number) {
    this.value = value;
  }
}
