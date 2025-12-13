import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class FrictionBlockComponent implements ComponentNamespace {
  @Ser({ default: () => 0.4 })
  value: number;

  get namespace(): string {
    return "minecraft:friction";
  }

  constructor(value: number) {
    this.value = value;
  }
}
