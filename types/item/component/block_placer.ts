import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";
import type { BlockDescriptor } from "@mcbe/types/block";

@Ser()
export class BlockPlacerItemComponent implements ComponentNamespace {
  @Ser()
  block: string;

  @Ser({ default: () => [] })
  useOn: BlockDescriptor[];

  @Ser({ default: () => false })
  replaceBlockItem: boolean;

  get namespace(): string {
    return "minecraft:block_placer";
  }

  constructor(
    input: InputProps<
      BlockPlacerItemComponent,
      "block",
      "useOn" | "replaceBlockItem"
    >,
  ) {
    this.block = input.block;
    this.useOn = input.useOn ?? [];
    this.replaceBlockItem = input.replaceBlockItem ?? false;
  }
}
