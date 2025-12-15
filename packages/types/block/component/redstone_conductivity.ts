import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/shared";

@SerClass()
export class RedstoneConductivityBlockComponent {
  @SerField({ default: () => true })
  allowsWireToStepDown: boolean;

  @SerField({ default: () => false })
  redstoneConductor: boolean;

  readonly namespace = "minecraft:redstone_conductivity";

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
