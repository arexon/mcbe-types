import { Ser } from "@mcbe/serialize";
import type { TintMethod } from "@mcbe/types/block";
import type { ComponentNamespace, InputProps, Vec3 } from "@mcbe/types/common";

@Ser({ transparent: "color" })
export class MapColorBlockComponent implements ComponentNamespace {
  @Ser()
  color: string | Vec3;

  @Ser()
  tintMethod?: TintMethod;

  get namespace(): string {
    return "minecraft:map_color";
  }

  constructor(
    input:
      | string
      | Vec3
      | InputProps<MapColorBlockComponent, "color" | "tintMethod">,
  ) {
    if (typeof input === "string" || Array.isArray(input)) {
      this.color = input;
    } else {
      this.color = input.color;
      this.tintMethod = input.tintMethod;
    }
  }
}
