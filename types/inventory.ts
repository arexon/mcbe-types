import { Edres } from "@mcbe/edres";
import type { InputProps } from "@mcbe/types/common";

@Edres()
export class InventoryMenuCategory {
  @Edres()
  category: "nature" | "equipment" | "items" | "construction" | "none";

  @Edres()
  group?: string;

  @Edres({ default: () => false })
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
