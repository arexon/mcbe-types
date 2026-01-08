import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class MaxStackSizeItemComponent implements ComponentNamespace {
  @Ser()
  value: number;

  get namespace(): string {
    return "minecraft:max_stack_size";
  }

  constructor(input: number) {
    this.value = input;
  }
}
