import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class StackedByDataItemComponent implements ComponentNamespace {
  @Ser()
  value: boolean;

  get namespace(): string {
    return "minecraft:stacked_by_data";
  }

  constructor(input: boolean) {
    this.value = input;
  }
}
