import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/shared";

@SerClass()
export class SupportBlockComponent {
  @SerField()
  shape: "fence" | "stair";

  static namespace: string = "minecraft:support";

  constructor(props: InputProps<SupportBlockComponent, "shape">) {
    this.shape = props.shape;
  }
}
