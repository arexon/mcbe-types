import { Serialize } from "@mcbe/serialize";
import type { TintMethod } from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize({ transparent: "color" })
export class MapColorBlockComponent implements ComponentNamespace {
  @Serialize()
  color: string | [number, number, number];

  @Serialize()
  tintMethod?: TintMethod;

  get namespace(): string {
    return "minecraft:map_color";
  }

  constructor(
    props: InputProps<MapColorBlockComponent, "color" | "tintMethod">,
  ) {
    this.color = props.color;
    this.tintMethod = props.tintMethod;
  }
}
