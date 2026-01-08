import { Ser } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";

export type BlockState = number | boolean | Identifier;

export type BlockDescriptor =
  | Identifier
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
  name: Identifier;

  @Ser({ default: () => ({}) })
  states: Record<Identifier, BlockState>;

  constructor(input: InputProps<BlockDescriptorName, "name", "states">) {
    this.name = input.name;
    this.states = input.states ?? {};
  }
}
