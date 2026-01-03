import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class MovableBlockComponent implements ComponentNamespace {
  @Edres({ default: () => "push_pull" })
  movementType: "immovable" | "popped" | "push" | "push_pull";

  @Edres({ default: () => "none" })
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
