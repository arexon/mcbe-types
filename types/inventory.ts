import { Serialize } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";

@Serialize()
export class InventoryMenuCategory {
  @Serialize()
  category: "nature" | "equipment" | "items" | "construction" | "none";

  @Serialize()
  group?: string;

  @Serialize({ default: () => false })
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
