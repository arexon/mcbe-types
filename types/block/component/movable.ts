import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class MovableBlockComponent implements ComponentNamespace {
  @Ser({ default: () => "push_pull" })
  movementType: "immovable" | "popped" | "push" | "push_pull";

  @Ser({ default: () => "none" })
  sticky: "none" | "sticky";

  get namespace(): string {
    return "minecraft:movable";
  }

  constructor(
    input: InputProps<MovableBlockComponent, "movementType", "sticky">,
  ) {
    this.movementType = input.movementType;
    this.sticky = input.sticky ?? "none";
  }
}
