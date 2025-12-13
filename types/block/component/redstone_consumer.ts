import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class RedstoneConsumerBlockComponent implements ComponentNamespace {
  @Ser()
  minPower: number;

  @Ser()
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
