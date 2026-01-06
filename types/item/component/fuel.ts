import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class FuelItemComponent implements ComponentNamespace {
  @Ser()
  duration: number;

  get namespace(): string {
    return "minecraft:fuel";
  }

  constructor(props: InputProps<FuelItemComponent, "duration">) {
    this.duration = props.duration;
  }
}
