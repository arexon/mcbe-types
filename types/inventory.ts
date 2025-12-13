import { Ser } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";

@Ser()
export class InventoryMenuCategory {
  @Ser()
  category: "nature" | "equipment" | "items" | "construction" | "none";

  @Ser()
  group?: string;

  @Ser({ default: () => false })
  isHiddenInCommand: boolean;

  constructor(
    props: InputProps<
      InventoryMenuCategory,
      "category",
      "group" | "isHiddenInCommand"
    >,
  ) {
    this.category = props.category;
    this.group = props.group;
    this.isHiddenInCommand = props.isHiddenInCommand ?? false;
  }
}
