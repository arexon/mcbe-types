import { Edres } from "@mcbe/edres";
import type { TintMethod } from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres({ transparent: "color" })
export class MapColorBlockComponent implements ComponentNamespace {
  @Edres()
  color: string | [number, number, number];

  @Edres()
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
