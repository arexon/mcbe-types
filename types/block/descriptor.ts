import { Serialize } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";

export type BlockState = number | boolean | Identifier;

export type BlockDescriptor =
  | Identifier
  | BlockDescriptorName
  | BlockDescriptorTags;

@Serialize()
export class BlockDescriptorTags {
  @Serialize()
  tags: string;

  constructor(props: InputProps<BlockDescriptorTags, "tags">) {
    this.tags = props.tags;
  }
}

@Serialize()
export class BlockDescriptorName {
  @Serialize()
  name: Identifier;

  @Serialize({ default: () => ({}) })
  states: Record<Identifier, BlockState>;

  constructor(props: InputProps<BlockDescriptorName, "name", "states">) {
    this.name = props.name;
    this.states = props.states ?? {};
  }
}
