import { Edres } from "@mcbe/edres";
import { BoundingBox } from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres({ transparent: "value" })
export class SelectionBoxBlockComponent implements ComponentNamespace {
  @Edres({ default: () => true })
  value: boolean | BoundingBox;

  get namespace(): string {
    return "minecraft:selection_box";
  }

  constructor(enable: boolean);
  constructor(props: InputProps<BoundingBox, "origin" | "size">);
  constructor(value: boolean | InputProps<BoundingBox, "origin" | "size">) {
    if (typeof value === "boolean") {
      this.value = value;
    } else {
      this.value = new BoundingBox(value);
    }
  }
}
