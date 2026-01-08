import { Ser } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";
import type { Identifier } from "@mcbe/types/identifier";

export type ItemDescriptor = Identifier | ItemDescriptorTags;

@Ser()
export class ItemDescriptorTags {
  @Ser()
  tags: string;

  constructor(input: InputProps<ItemDescriptorTags, "tags">) {
    this.tags = input.tags;
  }
}
