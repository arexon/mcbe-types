import { SerClass, SerField } from "@mcbe/serialize";
import type { BlockDescriptor } from "@mcbe/types/block";
import type { InputProps } from "@mcbe/types/common";

@SerClass()
export class PlacementFilterBlockComponent {
  @SerField({ default: () => [] })
  conditions: PlacementFilterCondition[];

  readonly namespace = "minecraft:placement_filter";

  constructor(
    props: InputProps<PlacementFilterBlockComponent, "conditions">,
  ) {
    this.conditions = props.conditions;
  }
}

@SerClass()
export class PlacementFilterCondition {
  @SerField({ default: () => [] })
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

  @SerField({ default: () => [] })
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
