import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace } from "@mcbe/types/common";

export type ItemUseAnimation =
  | "block"
  | "bow"
  | "brush"
  | "camera"
  | "crossbow"
  | "eat"
  | "drink"
  | "none"
  | "spear"
  | "spyglass";

@Ser({ transparent: "value" })
export class UseAnimationItemComponent implements ComponentNamespace {
  @Ser()
  value: ItemUseAnimation;

  get namespace(): string {
    return "minecraft:use_animation";
  }

  constructor(input: ItemUseAnimation) {
    this.value = input;
  }
}
