import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class EnchantableItemComponent implements ComponentNamespace {
  @Ser()
  slot: EnchantSlot;

  @Ser()
  value: number;

  get namespace(): string {
    return "minecraft:enchantable";
  }

  constructor(props: InputProps<EnchantableItemComponent, "slot" | "value">) {
    this.slot = props.slot;
    this.value = props.value;
  }
}

export type EnchantSlot =
  | "all"
  | "armor_feet"
  | "armor_head"
  | "armor_legs"
  | "armor_torso"
  | "axe"
  | "bow"
  | "carrot_stick"
  | "cosmetic_head"
  | "crossbow"
  | "elytra"
  | "fishing_rod"
  | "flintsteel"
  | "g_armor"
  | "g_digging"
  | "g_tool"
  | "hoe"
  | "none"
  | "pickaxe"
  | "shears"
  | "shield"
  | "shovel"
  | "spear"
  | "sword";
