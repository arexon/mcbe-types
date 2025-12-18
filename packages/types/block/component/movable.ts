import { SerClass, SerField } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@SerClass()
export class MovableBlockComponent implements ComponentNamespace {
  @SerField({ default: () => "push_pull" })
  movementType: "immovable" | "popped" | "push" | "push_pull";

  @SerField({ default: () => "none" })
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
