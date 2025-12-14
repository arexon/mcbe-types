import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/shared";

@SerClass()
export class RandomOffsetBlockComponent {
  @SerField()
  x?: RandomOffset;

  @SerField()
  y?: RandomOffset;

  @SerField()
  z?: RandomOffset;

  static namespace: string = "minecraft:random_offset";

  constructor(props: InputProps<RandomOffsetBlockComponent, "x" | "y" | "z">) {
    this.x = props.x;
    this.y = props.y;
    this.z = props.z;
  }
}

@SerClass()
export class RandomOffset {
  @SerField({ custom: ([min, max]) => ({ min, max }) })
  range: [number, number];

  @SerField()
  steps: number;

  constructor(props: InputProps<RandomOffset, "range" | "steps">) {
    this.range = props.range;
    this.steps = props.steps;
  }
}
