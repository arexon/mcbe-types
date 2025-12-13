import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Serialize({ transparent: "value" })
export class LightEmissionBlockComponent implements ComponentNamespace {
  @Serialize({ default: () => 0 })
  value: number;

  get namespace(): string {
    return "minecraft:light_emission";
  }

  constructor(value: number) {
    this.value = value;
  }
}
