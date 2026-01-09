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
    input: InputProps<
      InventoryMenuCategory,
      "category",
      "group" | "isHiddenInCommand"
    >,
  ) {
    this.category = input.category;
    this.group = input.group;
    this.isHiddenInCommand = input.isHiddenInCommand ?? false;
  }
}
