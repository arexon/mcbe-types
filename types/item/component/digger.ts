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
    props: InputProps<DiggerItemComponent, "useEfficiency" | "destroySpeed">,
  ) {
    this.useEfficiency = props.useEfficiency;
    this.destroySpeed = props.destroySpeed;
  }
}

@Ser()
export class BlockDestroySpeed {
  @Ser()
  block: BlockDescriptor;

  @Ser()
  speed: number;

  constructor(props: InputProps<BlockDestroySpeed, "block" | "speed">) {
    this.block = props.block;
    this.speed = props.speed;
  }
}
