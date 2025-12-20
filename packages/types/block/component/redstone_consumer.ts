import { SerClass, SerField } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@SerClass()
export class RedstoneConsumerBlockComponent implements ComponentNamespace {
  @SerField()
  minPower: number;

  @SerField()
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
