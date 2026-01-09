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

  constructor(input: InputProps<RandomOffsetBlockComponent, "x" | "y" | "z">) {
    this.x = input.x instanceof RandomOffset
      ? input.x
      : input.x !== undefined
      ? new RandomOffset(input.x)
      : undefined;
    this.y = input.y instanceof RandomOffset
      ? input.y
      : input.y !== undefined
      ? new RandomOffset(input.y)
      : undefined;
    this.z = input.z instanceof RandomOffset
      ? input.z
      : input.z !== undefined
      ? new RandomOffset(input.z)
      : undefined;
  }
}

@Ser()
export class RandomOffset {
  @Ser({ custom: [Range.customObject, "normal"] })
  range: Range;

  @Ser()
  steps: number;

  constructor(input: InputProps<RandomOffset, "range" | "steps">) {
    this.range = input.range;
    this.steps = input.steps;
  }
}
