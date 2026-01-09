import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps, Vec3 } from "@mcbe/types/common";

@Ser()
export class LeashableBlockComponent implements ComponentNamespace {
  @Ser()
  offset: Vec3;

  get namespace(): string {
    return "minecraft:leashable";
  }

  constructor(input: InputProps<LeashableBlockComponent, "offset">) {
    this.offset = input.offset;
  }
}
