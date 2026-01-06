import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class DamageItemComponent implements ComponentNamespace {
  @Ser()
  value: boolean;

  get namespace(): string {
    return "minecraft:damage";
  }

  constructor(props: InputProps<DamageItemComponent, "value">) {
    this.value = props.value;
  }
}
