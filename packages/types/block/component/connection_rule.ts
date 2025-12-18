import { SerClass, SerField } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@SerClass()
export class ConnectionRuleBlockComponent implements ComponentNamespace {
  @SerField()
  acceptsConnectionsFrom: "all" | "only_fences" | "none";

  @SerField()
  enabledDirections: "north" | "east" | "south" | "west";

  get namespace(): string {
    return "minecraft:connection_rule";
  }

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
