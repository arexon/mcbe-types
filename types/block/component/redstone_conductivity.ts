import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class RedstoneConductivityBlockComponent implements ComponentNamespace {
  @Serialize({ default: () => true })
  allowsWireToStepDown: boolean;

  @Serialize({ default: () => false })
  redstoneConductor: boolean;

  get namespace(): string {
    return "minecraft:redstone_conductivity";
  }

  constructor(
    props: InputProps<
      RedstoneConductivityBlockComponent,
      never,
      "allowsWireToStepDown" | "redstoneConductor"
    >,
  ) {
    this.allowsWireToStepDown = props.allowsWireToStepDown ?? true;
    this.redstoneConductor = props.redstoneConductor ?? false;
  }
}
