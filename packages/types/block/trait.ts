import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps, NamespacedContainer } from "@mcbe/types/shared";

export type BlockTraits = NamespacedContainer<
  | typeof PlacementDirectionBlockTrait
  | typeof PlacementPositionBlockTrait
>;

@SerClass()
export class PlacementPositionBlockTrait {
  @SerField()
  enabledStates: PlacementPositionState[];

  static namespace: string = "minecraft:placement_position";

  constructor(props: InputProps<PlacementPositionBlockTrait, "enabledStates">) {
    this.enabledStates = props.enabledStates;
  }
}

export const enum PlacementPositionState {
  BlockFace = "minecraft:block_face",
  VerticalHalf = "minecraft:vertical_half",
}

@SerClass()
export class PlacementDirectionBlockTrait {
  @SerField()
  enabledStates: PlacementDirectionState[];

  @SerField({ default: () => 0 })
  yRotationOffset: 0 | 90 | 180 | 270;

  static namespace: string = "minecraft:placement_direction";

  constructor(
    props: InputProps<
      PlacementDirectionBlockTrait,
      "enabledStates",
      "yRotationOffset"
    >,
  ) {
    this.enabledStates = props.enabledStates;
    this.yRotationOffset = props.yRotationOffset ?? 0;
  }
}

export const enum PlacementDirectionState {
  CardinalDirection = "minecraft:cardinal_direction",
  FacingDirection = "minecraft:facing_direction",
}
