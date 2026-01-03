import { Edres } from "@mcbe/edres";
import type { BlockDescriptor } from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Edres()
export class PlacementFilterBlockComponent implements ComponentNamespace {
  @Edres({ default: () => [] })
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

@Edres()
export class PlacementFilterCondition {
  @Edres({ default: () => [] })
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

  @Edres({ default: () => [] })
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
