import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class ConnectionRuleBlockComponent implements ComponentNamespace {
  @Ser()
  acceptsConnectionsFrom: "all" | "only_fences" | "none";

  @Ser()
  enabledDirections: "north" | "east" | "south" | "west";

  get namespace(): string {
    return "minecraft:connection_rule";
  }

  constructor(
    input: InputProps<
      ConnectionRuleBlockComponent,
      "acceptsConnectionsFrom" | "enabledDirections"
    >,
  ) {
    this.acceptsConnectionsFrom = input.acceptsConnectionsFrom;
    this.enabledDirections = input.enabledDirections;
  }
}
