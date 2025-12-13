import { Serialize } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class ConnectionRuleBlockComponent implements ComponentNamespace {
  @Serialize()
  acceptsConnectionsFrom: "all" | "only_fences" | "none";

  @Serialize()
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
