import { SerClass, SerField } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";

export type BlockState = number | boolean | Identifier;

export type BlockDescriptor =
  | Identifier
  | BlockDescriptorName
  | BlockDescriptorTags;

@SerClass()
export class BlockDescriptorTags {
  @SerField()
  tags: string;

  constructor(props: InputProps<BlockDescriptorTags, "tags">) {
    this.tags = props.tags;
  }
}

@SerClass()
export class BlockDescriptorName {
  @SerField()
  name: Identifier;

  @SerField({ default: () => ({}) })
  states: Record<Identifier, BlockState>;

  constructor(props: InputProps<BlockDescriptorName, "name", "states">) {
    this.name = props.name;
    this.states = props.states ?? {};
  }
}
