import { Ser } from "@mcbe/serialize";
import type { InputProps, InventoryCategory } from "@mcbe/types/common";
import type { ItemComponent } from "@mcbe/types/item";
import type { FormatVersion } from "@mcbe/types/version";
import { associateBy } from "@std/collections";

export * from "./component/mod.ts";
export * from "./descriptor.ts";

@Ser()
export class Item {
  @Ser()
  formatVersion: FormatVersion;

  @Ser({ path: "minecraft:item/description" })
  identifier: string;

  @Ser({
    path: "minecraft:item/description/menu_category",
    default: () => "none",
  })
  category: InventoryCategory;

  @Ser({ path: "minecraft:item/description/menu_category" })
  group?: string;

  @Ser({
    path: "minecraft:item/description/menu_category",
    default: () => false,
  })
  isHiddenInCommand: boolean;

  @Ser({
    path: "minecraft:item",
    default: () => [],
    custom: [(comps) => associateBy(comps, (comp) => comp.namespace), "normal"],
  })
  components: ItemComponent[];

  constructor(
    formatVersion: FormatVersion,
    input: InputProps<
      Item,
      "identifier" | "group",
      "category" | "isHiddenInCommand" | "components"
    >,
  ) {
    this.formatVersion = formatVersion;
    this.identifier = input.identifier;
    this.category = input.category ?? "none";
    this.group = input.group;
    this.isHiddenInCommand = input.isHiddenInCommand ?? false;
    this.components = input.components ?? [];
  }
}
