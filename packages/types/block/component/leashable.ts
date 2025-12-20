import { SerClass, SerField } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@SerClass()
export class LeashableBlockComponent implements ComponentNamespace {
  @SerField()
  offset: [number, number, number];

  get namespace(): string {
    return "minecraft:leashable";
  }

  constructor(props: InputProps<LeashableBlockComponent, "offset">) {
    this.offset = props.offset;
  }
}
