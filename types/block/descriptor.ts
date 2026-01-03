import { Edres } from "@mcbe/edres";
import type { InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";

export type BlockState = number | boolean | Identifier;

export type BlockDescriptor =
  | Identifier
  | BlockDescriptorName
  | BlockDescriptorTags;

@Edres()
export class BlockDescriptorTags {
  @Edres()
  tags: string;

  constructor(props: InputProps<BlockDescriptorTags, "tags">) {
    this.tags = props.tags;
  }
}

@Edres()
export class BlockDescriptorName {
  @Edres()
  name: Identifier;

  @Edres({ default: () => ({}) })
  states: Record<Identifier, BlockState>;

  constructor(props: InputProps<BlockDescriptorName, "name", "states">) {
    this.name = props.name;
    this.states = props.states ?? {};
  }
}
