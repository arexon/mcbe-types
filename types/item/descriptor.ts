import { Edres } from "@mcbe/edres";
import type { InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";

export type ItemDescriptor = Identifier | ItemDescriptorTags;

@Edres()
export class ItemDescriptorTags {
  @Edres()
  tags: string;

  constructor(props: InputProps<ItemDescriptorTags, "tags">) {
    this.tags = props.tags;
  }
}
