import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class TickBlockComponent implements ComponentNamespace {
  @Serialize({ default: () => [0, 0] })
  intervalRange: [number, number];

  @Serialize({ default: () => true })
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
