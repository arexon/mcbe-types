import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class FireResistantItemComponent implements ComponentNamespace {
  @Ser()
  value: boolean;

  get namespace(): string {
    return "minecraft:fire_resistant";
  }

  constructor(props: InputProps<FireResistantItemComponent, "value">) {
    this.value = props.value;
  }
}
