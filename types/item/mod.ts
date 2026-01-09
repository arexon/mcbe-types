import { Ser } from "@mcbe/serialize";
import { Components, type InputProps } from "@mcbe/types/common";
import { InventoryMenuCategory } from "@mcbe/types/inventory";
import type { ItemComponent } from "@mcbe/types/item";
import type { FormatVersion } from "@mcbe/types/version";

export * from "./component/mod.ts";
export * from "./descriptor.ts";

export class ItemComponents extends Components<ItemComponent> {}

@Ser()
export class Item {
  @Ser()
  formatVersion: FormatVersion;

  @Ser({ path: "minecraft:item/description" })
  identifier: string;

  @Ser({ path: "minecraft:item/description" })
  menuCategory: InventoryMenuCategory;

  @Ser({
    path: "minecraft:item",
    default: () => new ItemComponents(),
  })
  components: ItemComponents;

  constructor(
    formatVersion: FormatVersion,
    input: InputProps<Item, "identifier" | "menuCategory", "components">,
  ) {
    this.formatVersion = formatVersion;
    this.identifier = input.identifier;
    this.menuCategory = input.menuCategory instanceof InventoryMenuCategory
      ? input.menuCategory
      : new InventoryMenuCategory(input.menuCategory);
    this.components = input.components ?? new ItemComponents();
  }
}
