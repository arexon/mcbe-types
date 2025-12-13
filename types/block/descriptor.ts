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

  constructor(props: InputProps<BlockDescriptorTags, "tags">) {
    this.tags = props.tags;
  }
}

@Ser()
export class BlockDescriptorName {
  @Ser()
  name: Identifier;

  @Ser({ default: () => ({}) })
  states: Record<Identifier, BlockState>;

  constructor(props: InputProps<BlockDescriptorName, "name", "states">) {
    this.name = props.name;
    this.states = props.states ?? {};
  }
}
