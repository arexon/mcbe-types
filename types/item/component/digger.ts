import { Ser } from "@mcbe/serialize";
import type { BlockDescriptor } from "@mcbe/types/block";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser()
export class DiggerItemComponent implements ComponentNamespace {
  @Ser({ default: () => false })
  useEfficiency: boolean;

  @Ser()
  destroySpeed: BlockDestroySpeed[];

  get namespace(): string {
    return "minecraft:digger";
  }

  constructor(
    input: InputProps<DiggerItemComponent, "useEfficiency" | "destroySpeed">,
  ) {
    this.useEfficiency = input.useEfficiency;
    this.destroySpeed = input.destroySpeed;
  }
}

@Ser()
export class BlockDestroySpeed {
  @Ser()
  block: BlockDescriptor;

  @Ser()
  speed: number;

  constructor(input: InputProps<BlockDestroySpeed, "block" | "speed">) {
    this.block = input.block;
    this.speed = input.speed;
  }
}
