import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/shared";

@SerClass()
export class TickBlockComponent {
  @SerField({ default: () => [0, 0] })
  intervalRange: [number, number];

  @SerField({ default: () => true })
  looping: boolean;

  readonly namespace = "minecraft:tick";

  constructor(
    props: InputProps<TickBlockComponent, "intervalRange" | "looping">,
  ) {
    this.intervalRange = props.intervalRange;
    this.looping = props.looping;
  }
}
