import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class DyeableItemComponent implements ComponentNamespace {
  @Ser()
  defaultColor: string | [number, number, number];

  get namespace(): string {
    return "minecraft:dyeable";
  }

  constructor(props: InputProps<DyeableItemComponent, "defaultColor">) {
    this.defaultColor = props.defaultColor;
  }
}
