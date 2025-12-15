import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/shared";

@SerClass()
export class MovableBlockComponent {
  @SerField({ default: () => "push_pull" })
  movementType: "immovable" | "popped" | "push" | "push_pull";

  @SerField({ default: () => "none" })
  sticky: "none" | "sticky";

  readonly namespace = "minecraft:movable";

  constructor(
    props: InputProps<MovableBlockComponent, "movementType", "sticky">,
  ) {
    this.movementType = props.movementType;
    this.sticky = props.sticky ?? "none";
  }
}
