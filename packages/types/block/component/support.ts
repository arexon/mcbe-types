import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";

@SerClass()
export class SupportBlockComponent {
  @SerField()
  shape: "fence" | "stair";

  get namespace(): string {
    return "minecraft:support";
  }

  constructor(props: InputProps<SupportBlockComponent, "shape">) {
    this.shape = props.shape;
  }
}
