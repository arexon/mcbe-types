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
    input: InputProps<
      RedstoneConsumerBlockComponent,
      "minPower" | "propagatesPower"
    >,
  ) {
    this.minPower = input.minPower;
    this.propagatesPower = input.propagatesPower;
  }
}
