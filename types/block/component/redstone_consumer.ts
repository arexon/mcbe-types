import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class RedstoneConsumerBlockComponent implements ComponentNamespace {
  @Edres()
  minPower: number;

  @Edres()
  propagatesPower: boolean;

  get namespace(): string {
    return "minecraft:redstone_consumer";
  }

  constructor(
    props: InputProps<
      RedstoneConsumerBlockComponent,
      "minPower" | "propagatesPower"
    >,
  ) {
    this.minPower = props.minPower;
    this.propagatesPower = props.propagatesPower;
  }
}
