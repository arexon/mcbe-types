import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class RedstoneConductivityBlockComponent implements ComponentNamespace {
  @Edres({ default: () => true })
  allowsWireToStepDown: boolean;

  @Edres({ default: () => false })
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
