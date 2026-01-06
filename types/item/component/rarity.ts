import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

export type ItemRarity = "common" | "uncommon" | "rare" | "epic";

@Ser({ transparent: "value" })
export class RarityItemComponent implements ComponentNamespace {
  @Ser()
  value: ItemRarity;

  get namespace(): string {
    return "minecraft:rarity";
  }

  constructor(value: ItemRarity) {
    this.value = value;
  }
}
