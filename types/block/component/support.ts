import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class SupportBlockComponent implements ComponentNamespace {
  @Serialize()
  shape: "fence" | "stair";

  get namespace(): string {
    return "minecraft:support";
  }

  constructor(props: InputProps<SupportBlockComponent, "shape">) {
    this.shape = props.shape;
  }
}
