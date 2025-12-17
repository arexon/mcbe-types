import { SerClass, SerField } from "@mcbe/serialize";
import { BoundingBox } from "@mcbe/types/block";
import type { InputProps } from "@mcbe/types/common";

@SerClass({ transparent: "value" })
export class SelectionBoxBlockComponent {
  @SerField({ default: () => true })
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
