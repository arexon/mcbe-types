import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser()
export class SwingDurationItemComponent implements ComponentNamespace {
  @Ser({ default: () => 0.3 })
  value: number;

  get namespace(): string {
    return "minecraft:swing_duration";
  }

  constructor(value: number) {
    this.value = value;
  }
}
