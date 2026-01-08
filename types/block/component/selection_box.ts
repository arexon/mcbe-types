import { Ser } from "@mcbe/serialize";
import { BoundingBox } from "@mcbe/types/block";
import type { ComponentNamespace, DerivedInputProps } from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class SelectionBoxBlockComponent implements ComponentNamespace {
  @Ser({ default: () => true })
  value: boolean | BoundingBox;

  get namespace(): string {
    return "minecraft:selection_box";
  }

  constructor(input: boolean | DerivedInputProps<typeof BoundingBox>) {
    if (typeof input === "boolean") {
      this.value = input;
    } else {
      this.value = input instanceof BoundingBox
        ? input
        : new BoundingBox(input);
    }
  }
}
