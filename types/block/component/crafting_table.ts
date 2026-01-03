import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";
import type { LocalizationText } from "@mcbe/types/text";

@Edres()
export class CraftingTableBlockComponent implements ComponentNamespace {
  @Edres()
  craftingTags: string[];

  @Edres()
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
