import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class RedstoneConductivityBlockComponent implements ComponentNamespace {
  @Ser({ default: () => true })
  allowsWireToStepDown: boolean;

  @Ser({ default: () => false })
  redstoneConductor: boolean;

  get namespace(): string {
    return "minecraft:redstone_conductivity";
  }

  constructor(
    input: InputProps<
      RedstoneConductivityBlockComponent,
      never,
      "allowsWireToStepDown" | "redstoneConductor"
    >,
  ) {
    this.allowsWireToStepDown = input.allowsWireToStepDown ?? true;
    this.redstoneConductor = input.redstoneConductor ?? false;
  }
}
