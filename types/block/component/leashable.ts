import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class LeashableBlockComponent implements ComponentNamespace {
  @Edres()
  offset: [number, number, number];

  get namespace(): string {
    return "minecraft:leashable";
  }

  constructor(props: InputProps<LeashableBlockComponent, "offset">) {
    this.offset = props.offset;
  }
}
