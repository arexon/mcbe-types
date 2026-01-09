import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class HoverTextColorItemComponent implements ComponentNamespace {
  @Ser()
  value: ColorCode;

  get namespace(): string {
    return "minecraft:hover_text_color";
  }

  constructor(input: ColorCode) {
    this.value = input;
  }
}

export type ColorCode =
  | "dark_red"
  | "red"
  | "gold"
  | "yellow"
  | "dark_green"
  | "green"
  | "aqua"
  | "dark_aqua"
  | "dark_blue"
  | "blue"
  | "light_purple"
  | "dark_purple"
  | "white"
  | "gray"
  | "dark_gray"
  | "black"
  | "minecoin_gold";
