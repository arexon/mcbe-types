import { Edres } from "@mcbe/edres";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class ConnectionRuleBlockComponent implements ComponentNamespace {
  @Edres()
  acceptsConnectionsFrom: "all" | "only_fences" | "none";

  @Edres()
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
