import { Ser } from "@mcbe/serialize";
import type { BlockDescriptor } from "@mcbe/types/block";
import type {
  ComponentNamespace,
  DerivedInputProps,
  InputProps,
} from "@mcbe/types/common";

const mapConditionsFn = (
  v: DerivedInputProps<typeof PlacementFilterCondition>,
): PlacementFilterCondition =>
  v instanceof PlacementFilterCondition ? v : new PlacementFilterCondition(v);

@Ser()
export class PlacementFilterBlockComponent implements ComponentNamespace {
  @Ser({ default: () => [] })
  conditions: PlacementFilterCondition[];

  get namespace(): string {
    return "minecraft:placement_filter";
  }

  constructor(
    input:
      | DerivedInputProps<typeof PlacementFilterCondition>[]
      | InputProps<PlacementFilterBlockComponent, "conditions">,
  ) {
    if (Array.isArray(input)) {
      this.conditions = input.map(mapConditionsFn);
    } else {
      this.conditions = input.conditions.map(mapConditionsFn);
    }
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
    input: InputProps<
      PlacementFilterCondition,
      never,
      "allowedFaces" | "blockFilter"
    >,
  ) {
    this.allowedFaces = input.allowedFaces ?? [];
    this.blockFilter = input.blockFilter ?? [];
  }
}
