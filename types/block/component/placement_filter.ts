import { Serialize } from "@mcbe/serialize";
import type { BlockDescriptor } from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Serialize()
export class PlacementFilterBlockComponent implements ComponentNamespace {
  @Serialize({ default: () => [] })
  conditions: PlacementFilterCondition[];

  get namespace(): string {
    return "minecraft:placement_filter";
  }

  constructor(
    props: InputProps<PlacementFilterBlockComponent, "conditions">,
  ) {
    this.conditions = props.conditions;
  }
}

@Serialize()
export class PlacementFilterCondition {
  @Serialize({ default: () => [] })
  allowedFaces: (
    | "all"
    | "side"
    | "down"
    | "up"
    | "north"
    | "south"
    | "west"
    | "east"
  )[];

  @Serialize({ default: () => [] })
  blockFilter: BlockDescriptor[];

  constructor(
    props: InputProps<
      PlacementFilterCondition,
      never,
      "allowedFaces" | "blockFilter"
    >,
  ) {
    this.allowedFaces = props.allowedFaces ?? [];
    this.blockFilter = props.blockFilter ?? [];
  }
}
