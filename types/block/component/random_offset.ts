import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class RandomOffsetBlockComponent implements ComponentNamespace {
  @Serialize()
  x?: RandomOffset;

  @Serialize()
  y?: RandomOffset;

  @Serialize()
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

@Serialize()
export class RandomOffset {
  @Serialize({
    custom: [([min, max]) => ({ min, max }), "normal"],
  })
  range: [number, number];

  @Serialize()
  steps: number;

  constructor(props: InputProps<RandomOffset, "range" | "steps">) {
    this.range = props.range;
    this.steps = props.steps;
  }
}
