import { SerClass, SerField } from "@mcbe/serialize";
import type { TintMethod } from "@mcbe/types/block";
import type { InputProps } from "@mcbe/types/common";

@SerClass({ transparent: "color" })
export class MapColorBlockComponent {
  @SerField()
  color: string | [number, number, number];

  @SerField()
  tintMethod?: TintMethod;

  readonly namespace = "minecraft:map_color";

  constructor(
    props: InputProps<MapColorBlockComponent, "color" | "tintMethod">,
  ) {
    this.color = props.color;
    this.tintMethod = props.tintMethod;
  }
}
