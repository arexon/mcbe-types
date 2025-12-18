import { SerClass, SerField } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@SerClass({ transparent: "value" })
export class FrictionBlockComponent implements ComponentNamespace {
  @SerField({ default: () => 0.4 })
  value: number;

  get namespace(): string {
    return "minecraft:friction";
  }

  constructor(value: number) {
    this.value = value;
  }
}
