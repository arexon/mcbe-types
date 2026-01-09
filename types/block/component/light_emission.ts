import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class LightEmissionBlockComponent implements ComponentNamespace {
  @Ser({ default: () => 0 })
  value: number;

  get namespace(): string {
    return "minecraft:light_emission";
  }

  constructor(input: number) {
    this.value = input;
  }
}
