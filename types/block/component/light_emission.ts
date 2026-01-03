import { Edres } from "@mcbe/edres";
import type { ComponentNamespace } from "@mcbe/types/common";

@Edres({ transparent: "value" })
export class LightEmissionBlockComponent implements ComponentNamespace {
  @Edres({ default: () => 0 })
  value: number;

  get namespace(): string {
    return "minecraft:light_emission";
  }

  constructor(value: number) {
    this.value = value;
  }
}
