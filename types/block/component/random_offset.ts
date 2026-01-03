import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class RandomOffsetBlockComponent implements ComponentNamespace {
  @Edres()
  x?: RandomOffset;

  @Edres()
  y?: RandomOffset;

  @Edres()
  z?: RandomOffset;

  get namespace(): string {
    return "minecraft:random_offset";
  }

  constructor(props: InputProps<RandomOffsetBlockComponent, "x" | "y" | "z">) {
    this.x = props.x;
    this.y = props.y;
    this.z = props.z;
  }
}

@Edres()
export class RandomOffset {
  @Edres({
    custom: [([min, max]) => ({ min, max }), "normal"],
  })
  range: [number, number];

  @Edres()
  steps: number;

  constructor(props: InputProps<RandomOffset, "range" | "steps">) {
    this.range = props.range;
    this.steps = props.steps;
  }
}
