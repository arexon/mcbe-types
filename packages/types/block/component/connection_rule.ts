import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/shared";

@SerClass()
export class ConnectionRuleBlockComponent {
  @SerField()
  acceptsConnectionsFrom: "all" | "only_fences" | "none";

  @SerField()
  enabledDirections: "north" | "east" | "south" | "west";

  readonly namespace = "minecraft:connection_rule";

  constructor(
    props: InputProps<
      ConnectionRuleBlockComponent,
      "acceptsConnectionsFrom" | "enabledDirections"
    >,
  ) {
    this.acceptsConnectionsFrom = props.acceptsConnectionsFrom;
    this.enabledDirections = props.enabledDirections;
  }
}
