import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class LeashableBlockComponent implements ComponentNamespace {
  @Serialize()
  offset: [number, number, number];

  get namespace(): string {
    return "minecraft:leashable";
  }

  constructor(props: InputProps<LeashableBlockComponent, "offset">) {
    this.offset = props.offset;
  }
}
