import { Edres } from "@mcbe/edres";
import type { ComponentNamespace } from "@mcbe/types/common";

@Edres({ transparent: "value" })
export class FrictionBlockComponent implements ComponentNamespace {
  @Edres({ default: () => 0.4 })
  value: number;

  get namespace(): string {
    return "minecraft:friction";
  }

  constructor(value: number) {
    this.value = value;
  }
}
