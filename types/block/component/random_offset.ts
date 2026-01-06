import { Ser } from "@mcbe/serialize";
import {
  type ComponentNamespace,
  type InputProps,
  Range,
} from "@mcbe/types/common";

@Ser()
export class RandomOffsetBlockComponent implements ComponentNamespace {
  @Ser()
  x?: RandomOffset;

  @Ser()
  y?: RandomOffset;

  @Ser()
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

@Ser()
export class RandomOffset {
  @Ser({ custom: [Range.customObject, "normal"] })
  range: Range;

  @Ser()
  steps: number;

  constructor(props: InputProps<RandomOffset, "range" | "steps">) {
    this.range = props.range;
    this.steps = props.steps;
  }
}
