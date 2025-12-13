import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class TickBlockComponent implements ComponentNamespace {
  @Ser({ default: () => [0, 0] })
  intervalRange: [number, number];

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
