import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/shared";
import type { LocalizationText } from "@mcbe/types/text";

@SerClass()
export class CraftingTableBlockComponent {
  @SerField()
  craftingTags: string[];

  @SerField()
  tableName?: LocalizationText;

  readonly namespace = "minecraft:crafting_table";

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
