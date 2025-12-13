import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";
import type { LocalizationText } from "@mcbe/types/text";

@Ser()
export class CraftingTableBlockComponent implements ComponentNamespace {
  @Ser()
  craftingTags: string[];

  @Ser()
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
