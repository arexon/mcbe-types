import { Ser } from "@mcbe/serialize";
import { Components, type InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";
import type { InventoryMenuCategory } from "@mcbe/types/inventory";
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
  identifier: Identifier;

  @Ser({ path: "minecraft:item/description" })
  menuCategory: InventoryMenuCategory;

  @Ser({
    path: "minecraft:item",
    default: () => new ItemComponents(),
  })
  components: ItemComponents;

  constructor(
    formatVersion: FormatVersion,
    props: InputProps<Item, "identifier" | "menuCategory", "components">,
  ) {
    this.formatVersion = formatVersion;
    this.identifier = props.identifier;
    this.menuCategory = props.menuCategory;
    this.components = props.components ?? new ItemComponents();
  }
}
