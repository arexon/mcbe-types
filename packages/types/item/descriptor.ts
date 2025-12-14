import { SerClass, SerField } from "@mcbe/serialize";
import type { Identifier } from "@mcbe/types/identifier";
import type { InputProps } from "@mcbe/types/shared";

export type ItemDescriptor = Identifier | ItemDescriptorTags;

@SerClass()
export class ItemDescriptorTags {
  @SerField()
  tags: string;

  constructor(props: InputProps<ItemDescriptorTags, "tags">) {
    this.tags = props.tags;
  }
}
