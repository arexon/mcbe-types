import { SerClass, SerField } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@SerClass()
export class RedstoneConductivityBlockComponent implements ComponentNamespace {
  @SerField({ default: () => true })
  allowsWireToStepDown: boolean;

  @SerField({ default: () => false })
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
