import { SerClass, SerField } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@SerClass()
export class RandomOffsetBlockComponent implements ComponentNamespace {
  @SerField()
  x?: RandomOffset;

  @SerField()
  y?: RandomOffset;

  @SerField()
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

@SerClass()
export class RandomOffset {
  @SerField({
    custom: ([min, max]) => ({ value: { min, max }, strategy: "normal" }),
  })
  range: [number, number];

  @SerField()
  steps: number;

  constructor(props: InputProps<RandomOffset, "range" | "steps">) {
    this.range = props.range;
    this.steps = props.steps;
  }
}
