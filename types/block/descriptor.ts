import { Ser } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";

export type BlockState = number | boolean | string;

export type BlockDescriptor =
  | string
  | BlockDescriptorName
  | BlockDescriptorTags;

@Ser()
export class BlockDescriptorTags {
  @Ser()
  tags: string;

  constructor(input: InputProps<BlockDescriptorTags, "tags">) {
    this.tags = input.tags;
  }
}

@Ser()
export class BlockDescriptorName {
  @Ser()
  name: string;

  @Ser({ default: () => ({}) })
  states: Record<string, BlockState>;

  constructor(input: InputProps<BlockDescriptorName, "name", "states">) {
    this.name = input.name;
    this.states = input.states ?? {};
  }
}
