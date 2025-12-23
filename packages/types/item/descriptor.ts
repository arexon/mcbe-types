import { Serialize } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";

export type ItemDescriptor = Identifier | ItemDescriptorTags;

@Serialize()
export class ItemDescriptorTags {
  @Serialize()
  tags: string;

  constructor(props: InputProps<ItemDescriptorTags, "tags">) {
    this.tags = props.tags;
  }
}
