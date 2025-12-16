import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";

@SerClass()
export class InventoryMenuCategory {
  @SerField()
  category: InventoryItemCategory;

  @SerField()
  group?: string;

  @SerField({ default: () => false })
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

export const enum InventoryItemCategory {
  Nature = "Nature",
  Equipment = "Equipment",
  Items = "Items",
  Construction = "Construction",
  None = "None",
}
