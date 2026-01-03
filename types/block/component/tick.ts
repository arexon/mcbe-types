import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class TickBlockComponent implements ComponentNamespace {
  @Edres({ default: () => [0, 0] })
  intervalRange: [number, number];

  @Edres({ default: () => true })
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
