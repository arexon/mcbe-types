import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps, Vec3 } from "@mcbe/types/common";

@Ser()
export class DyeableItemComponent implements ComponentNamespace {
  @Ser()
  defaultColor: string | Vec3;

  get namespace(): string {
    return "minecraft:dyeable";
  }

  constructor(input: InputProps<DyeableItemComponent, "defaultColor">) {
    this.defaultColor = input.defaultColor;
  }
}
