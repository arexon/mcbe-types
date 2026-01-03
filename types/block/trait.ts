import { Edres } from "@mcbe/edres";
import {
  type ComponentNamespace,
  Components,
  type InputProps,
} from "@mcbe/types/common";

export type BlockTrait =
  | ConnectionBlockTrait
  | PlacementDirectionBlockTrait
  | PlacementPositionBlockTrait;

// deno-lint-ignore style-guide/class-serialization
export class BlockTraits extends Components<BlockTrait> {}

@Edres()
export class ConnectionBlockTrait implements ComponentNamespace {
  @Edres()
  enabledStates: ("minecraft:cardinal_connections")[];

  get namespace(): string {
    return "minecraft:connection";
  }

  constructor(props: InputProps<ConnectionBlockTrait, "enabledStates">) {
    this.enabledStates = props.enabledStates;
  }
}

@Edres()
export class PlacementPositionBlockTrait implements ComponentNamespace {
  @Edres()
  enabledStates: ("minecraft:block_face" | "minecraft:vertical_half")[];

  get namespace(): string {
    return "minecraft:placement_position";
  }

  constructor(props: InputProps<PlacementPositionBlockTrait, "enabledStates">) {
    this.enabledStates = props.enabledStates;
  }
}

@Edres()
export class PlacementDirectionBlockTrait implements ComponentNamespace {
  @Edres()
  enabledStates:
    ("minecraft:cardinal_direction" | "minecraft:facing_direction")[];

  @Edres({ default: () => 0 })
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
