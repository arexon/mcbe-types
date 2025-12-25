import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class MovableBlockComponent implements ComponentNamespace {
  @Serialize({ default: () => "push_pull" })
  movementType: "immovable" | "popped" | "push" | "push_pull";

  @Serialize({ default: () => "none" })
  sticky: "none" | "sticky";

  get namespace(): string {
    return "minecraft:movable";
  }

  constructor(
    props: InputProps<MovableBlockComponent, "movementType", "sticky">,
  ) {
    this.movementType = props.movementType;
    this.sticky = props.sticky ?? "none";
  }
}
