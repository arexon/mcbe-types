import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";
import type { LocalizationText } from "@mcbe/types/text";

@Serialize()
export class CraftingTableBlockComponent implements ComponentNamespace {
  @Serialize()
  craftingTags: string[];

  @Serialize()
  tableName?: LocalizationText;

  get namespace(): string {
    return "minecraft:crafting_table";
  }

  constructor(
    props: InputProps<
      CraftingTableBlockComponent,
      "craftingTags" | "tableName"
    >,
  ) {
    this.craftingTags = props.craftingTags;
    this.tableName = props.tableName;
  }
}
