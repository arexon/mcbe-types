import { SerClass, SerField } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";
import type { LocalizationText } from "@mcbe/types/text";

@SerClass()
export class CraftingTableBlockComponent implements ComponentNamespace {
  @SerField()
  craftingTags: string[];

  @SerField()
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
