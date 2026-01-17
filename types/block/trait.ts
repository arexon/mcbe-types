import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

export type BlockTrait =
  | ConnectionBlockTrait
  | PlacementDirectionBlockTrait
  | PlacementPositionBlockTrait;

@Ser()
export class ConnectionBlockTrait implements ComponentNamespace {
  @Ser()
  enabledStates: ("minecraft:cardinal_connections")[];

  get namespace(): string {
    return "minecraft:connection";
  }

  constructor(input: InputProps<ConnectionBlockTrait, "enabledStates">) {
    this.enabledStates = input.enabledStates;
  }
}

@Ser()
export class PlacementPositionBlockTrait implements ComponentNamespace {
  @Ser()
  enabledStates: ("minecraft:block_face" | "minecraft:vertical_half")[];

  get namespace(): string {
    return "minecraft:placement_position";
  }

  constructor(input: InputProps<PlacementPositionBlockTrait, "enabledStates">) {
    this.enabledStates = input.enabledStates;
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
    input: InputProps<
      PlacementDirectionBlockTrait,
      "enabledStates",
      "yRotationOffset"
    >,
  ) {
    this.enabledStates = input.enabledStates;
    this.yRotationOffset = input.yRotationOffset ?? 0;
  }
}
