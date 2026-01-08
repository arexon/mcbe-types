import { Ser } from "@mcbe/serialize";
import {
  type ComponentNamespace,
  type InputProps,
  Range,
} from "@mcbe/types/common";

@Ser()
export class TickBlockComponent implements ComponentNamespace {
  @Ser({
    custom: [Range.customTuple, "normal"],
    default: () => new Range(0, 0),
  })
  intervalRange: Range;

  @Ser({ default: () => true })
  looping: boolean;

  get namespace(): string {
    return "minecraft:tick";
  }

  constructor(
    input: InputProps<TickBlockComponent, "intervalRange" | "looping">,
  ) {
    this.intervalRange = input.intervalRange;
    this.looping = input.looping;
  }
}
