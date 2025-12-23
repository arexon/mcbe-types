import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Serialize({ transparent: "value" })
export class FrictionBlockComponent implements ComponentNamespace {
  @Serialize({ default: () => 0.4 })
  value: number;

  get namespace(): string {
    return "minecraft:friction";
  }

  constructor(value: number) {
    this.value = value;
  }
}
