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
    props: InputProps<TickBlockComponent, "intervalRange" | "looping">,
  ) {
    this.intervalRange = props.intervalRange;
    this.looping = props.looping;
  }
}
