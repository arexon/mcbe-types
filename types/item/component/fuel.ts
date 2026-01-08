import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class FuelItemComponent implements ComponentNamespace {
  @Ser()
  duration: number;

  get namespace(): string {
    return "minecraft:fuel";
  }

  constructor(input: InputProps<FuelItemComponent, "duration">) {
    this.duration = input.duration;
  }
}
