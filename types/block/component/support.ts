import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class SupportBlockComponent implements ComponentNamespace {
  @Edres()
  shape: "fence" | "stair";

  get namespace(): string {
    return "minecraft:support";
  }

  constructor(props: InputProps<SupportBlockComponent, "shape">) {
    this.shape = props.shape;
  }
}
