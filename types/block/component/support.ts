import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class SupportBlockComponent implements ComponentNamespace {
  @Ser()
  shape: "fence" | "stair";

  get namespace(): string {
    return "minecraft:support";
  }

  constructor(input: InputProps<SupportBlockComponent, "shape">) {
    this.shape = input.shape;
  }
}
