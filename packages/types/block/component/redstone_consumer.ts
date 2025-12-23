import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class RedstoneConsumerBlockComponent implements ComponentNamespace {
  @Serialize()
  minPower: number;

  @Serialize()
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
