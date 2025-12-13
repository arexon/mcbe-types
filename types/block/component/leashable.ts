import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class LeashableBlockComponent implements ComponentNamespace {
  @Ser()
  offset: [number, number, number];

  get namespace(): string {
    return "minecraft:leashable";
  }

  constructor(props: InputProps<LeashableBlockComponent, "offset">) {
    this.offset = props.offset;
  }
}
