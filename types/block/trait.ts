import { Ser } from "@mcbe/serialize";
import {
  type ComponentNamespace,
  Components,
  type InputProps,
} from "@mcbe/types/common";

export type BlockTrait =
  | ConnectionBlockTrait
  | PlacementDirectionBlockTrait
  | PlacementPositionBlockTrait;

export class BlockTraits extends Components<BlockTrait> {}

@Ser()
export class ConnectionBlockTrait implements ComponentNamespace {
  @Ser()
  enabledStates: ("minecraft:cardinal_connections")[];

  get namespace(): string {
    return "minecraft:connection";
  }

  constructor(props: InputProps<ConnectionBlockTrait, "enabledStates">) {
    this.enabledStates = props.enabledStates;
  }
}

@Ser()
export class PlacementPositionBlockTrait implements ComponentNamespace {
  @Ser()
  enabledStates: ("minecraft:block_face" | "minecraft:vertical_half")[];

  get namespace(): string {
    return "minecraft:placement_position";
  }

  constructor(props: InputProps<PlacementPositionBlockTrait, "enabledStates">) {
    this.enabledStates = props.enabledStates;
  }
}

@Ser()
export class PlacementDirectionBlockTrait implements ComponentNamespace {
  @Ser()
  enabledStates:
    ("minecraft:cardinal_direction" | "minecraft:facing_direction")[];

  @Ser({ default: () => 0 })
  yRotationOffset: 0 | 90 | 180 | 270;

  get namespace(): string {
    return "minecraft:placement_direction";
  }

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
