import { Ser } from "@mcbe/serialize";
import type { BlockDescriptor } from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class PlacementFilterBlockComponent implements ComponentNamespace {
  @Ser({ default: () => [] })
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

@Ser()
export class PlacementFilterCondition {
  @Ser({ default: () => [] })
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

  @Ser({ default: () => [] })
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
