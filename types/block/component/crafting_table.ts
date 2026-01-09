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
    input: InputProps<
      CraftingTableBlockComponent,
      "craftingTags" | "tableName"
    >,
  ) {
    this.craftingTags = input.craftingTags;
    this.tableName = input.tableName;
  }
}
