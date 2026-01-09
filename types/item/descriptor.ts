import { Ser } from "@mcbe/serialize";
import type { InputProps } from "@mcbe/types/common";

export type ItemDescriptor = string | ItemDescriptorTags;

@Ser()
export class ItemDescriptorTags {
  @Ser()
  tags: string;

  constructor(input: InputProps<ItemDescriptorTags, "tags">) {
    this.tags = input.tags;
  }
}
