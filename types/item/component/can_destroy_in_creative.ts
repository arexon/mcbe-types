import { Ser } from "@mcbe/serialize";
import type { ComponentNamespace, InputProps } from "@mcbe/types/common";

@Ser({ transparent: "value" })
export class CanDestroyInCreativeItemComponent implements ComponentNamespace {
  @Ser({ default: () => true })
  value: boolean;

  get namespace(): string {
    return "minecraft:can_destroy_in_creative";
  }

  constructor(
    props: InputProps<CanDestroyInCreativeItemComponent, never, "value">,
  ) {
    this.value = props.value ?? true;
  }
}
